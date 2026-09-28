import type { JSX } from 'solid-js';
import { createContext, createEffect, createMemo, createSignal, on, onCleanup, onMount, useContext } from 'solid-js';
import * as kodi from '../lib/kodi';
import { KodiError } from '../lib/kodi';
import type { Connection } from '../lib/types';
import { errorMessage, t } from '../utils/i18n';
import { useStore } from './StoreProvider';

export type Action = 'play' | 'queue' | 'stop' | 'ping';
export type Status = { type: 'success' | 'error'; message: string };
export type Reachability = 'unknown' | 'online' | 'offline';

type Api = {
  pending: () => Action | undefined;
  url: () => string;
  setUrl: (url: string) => void;
  status: () => Status | undefined;
  reachability: () => Reachability;
  sendPing: () => Promise<void>;
  stop: () => Promise<void>;
  sendToKodi: () => Promise<void>;
  addToQueue: () => Promise<void>;
};

const ApiContext = createContext<Api>();

type ApiProviderProps = {
  children: JSX.Element;
};

// Only network failures mean "offline"; e.g. wrong credentials prove that Kodi is reachable.
const toReachability = (error: unknown): Reachability =>
  error instanceof KodiError && ['timeout', 'unreachable'].includes(error.code) ? 'offline' : 'online';

const SUCCESS_MESSAGES: Record<Action, string> = {
  play: 'successPlay',
  queue: 'successQueue',
  stop: 'successStop',
  ping: 'successPing',
};

export const ApiProvider = (props: ApiProviderProps) => {
  const [pending, setPending] = createSignal<Action>();
  const [url, setUrlSignal] = createSignal('');
  const [title, setTitle] = createSignal('');
  const [status, setStatus] = createSignal<Status>();
  const [reachability, setReachability] = createSignal<Reachability>('unknown');
  const { selectedConnection, selectedConnectionId } = useStore();

  // A manually edited URL no longer belongs to the tab title.
  const setUrl = (value: string) => {
    setUrlSignal(value);
    setTitle('');
  };

  const run = async (action: Action, request: (connection: Connection) => Promise<unknown>, closeOnSuccess = false) => {
    if (pending()) return;
    const connection = selectedConnection();
    if (!connection?.ip.trim()) {
      setStatus({ type: 'error', message: errorMessage(new KodiError('noHost')) });
      return;
    }

    setPending(action);
    setStatus(undefined);
    try {
      // Must be the first await so the permission prompt still counts as a user gesture.
      if (!(await kodi.requestHostPermission(connection))) throw new KodiError('permission');
      await request(connection);
      setReachability('online');
      if (closeOnSuccess) {
        window.close();
        return;
      }
      setStatus({ type: 'success', message: t(SUCCESS_MESSAGES[action]) });
    } catch (error) {
      console.error(error);
      if (!(error instanceof KodiError && error.code === 'permission')) setReachability(toReachability(error));
      setStatus({ type: 'error', message: errorMessage(error) });
    } finally {
      setPending(undefined);
    }
  };

  const requireUrl = () => {
    if (url().trim()) return true;
    setStatus({ type: 'error', message: `✗ ${t('noUrl')}` });
    return false;
  };

  const sendToKodi = async () => {
    if (!requireUrl()) return;
    await run('play', (c) => kodi.play(c, url()), true);
  };

  const addToQueue = async () => {
    if (!requireUrl()) return;
    await run('queue', (c) => kodi.queue(c, url(), title()));
  };

  const stop = () => run('stop', kodi.stop);

  const sendPing = () => run('ping', kodi.ping);

  // Show whether the selected Kodi is reachable, without prompting for permissions.
  const connectionKey = createMemo(() => {
    const c = selectedConnection();
    return c ? JSON.stringify([c.id, c.ip, c.port, c.secure, c.login, c.pw]) : '';
  });
  let reachabilityTimer: ReturnType<typeof setTimeout> | undefined;
  const checkReachability = async (key: string) => {
    const connection = selectedConnection();
    if (!connection || !(await kodi.hasHostPermission(connection))) return;
    const result = await kodi.ping(connection).then(() => 'online' as const, toReachability);
    if (connectionKey() === key) setReachability(result);
  };
  createEffect(
    on(connectionKey, (key) => {
      setReachability('unknown');
      clearTimeout(reachabilityTimer);
      if (key) reachabilityTimer = setTimeout(() => checkReachability(key), 500);
    })
  );
  onCleanup(() => clearTimeout(reachabilityTimer));

  createEffect(on(selectedConnectionId, () => setStatus(undefined), { defer: true }));

  onMount(async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
    const tabUrl = tab?.url ?? '';
    // Internal pages (chrome://, about:, extension pages) cannot be played by Kodi.
    if (/^https?:\/\//.test(tabUrl)) {
      setUrlSignal(tabUrl);
      setTitle(tab?.title ?? '');
    }
  });

  return (
    <ApiContext.Provider
      value={{
        pending,
        url,
        setUrl,
        status,
        reachability,
        sendPing,
        sendToKodi,
        addToQueue,
        stop,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
