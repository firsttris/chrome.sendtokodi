import { createContext, onMount, useContext, createSignal } from 'solid-js';
import { Connection } from "../components/types";
import { useStore } from "./StoreProvider";
import type { JSX } from 'solid-js';

interface JsonRpcBody {
  jsonrpc: string;
  method: string;
  id: number;
  params: Record<string, unknown>;
}

interface JsonRpcResponse {
  id: number;
  result: string;
}

type Api = {
  loading: () => boolean;
  url: () => string;
  setUrl: (url: string) => void;
  status: () => string;
  sendPing: () => Promise<void>;
  stop: () => void;
  sendToKodi: () => void;
  addToQueue: () => void;
};

const ApiContext = createContext<Api>();

type ApiProviderProps = {
  children: JSX.Element;
};

export const ApiProvider = (props: ApiProviderProps) => {
  const [loading, setLoading] = createSignal(false);
  const [url, setUrl] = createSignal('');
  const [title, setTitle] = createSignal('');
  const [status, setStatus] = createSignal('');
  const { selectedConnection } = useStore();

  const getReadableErrorMessage = (error: unknown) => {
    const message = (error as Error)?.message || 'Unbekannter Fehler';
    if (message.includes('Failed to fetch')) {
      return '✗ Verbindung fehlgeschlagen - Kodi nicht erreichbar';
    }
    return `✗ Fehler: ${message}`;
  };

  const createAuthHeader = (connection: Connection) => 
    'Basic ' + btoa(`${connection.login}:${connection.pw || ''}`);

  const createKodiUrl = (connection: Connection) => 
    `http://${connection.ip}:${connection.port}/jsonrpc`;

  const sendJsonRpc = async (connection: Connection, body: JsonRpcBody): Promise<JsonRpcResponse> => {
    const response = await fetch(createKodiUrl(connection), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': createAuthHeader(connection)
      },
      body: JSON.stringify(body)
    });

    const json = await response.json();
    if (json.error) throw new Error(JSON.stringify(json.error));
    return json;
  };

  const executeRequest = async (body: JsonRpcBody, closeOnSuccess = false) => {
    if (loading()) return;

    const connection = selectedConnection();
    if (!connection) {
      console.error('No connection selected');
      setStatus('✗ Keine Verbindung ausgewählt');
      openSettings();
      return;
    }

    setStatus('');
    setLoading(true);
    try {
      const response = await sendJsonRpc(connection, body);
      if (response.result === 'OK' && !closeOnSuccess) {
        setStatus('✓ Erfolgreich');
      }
      if (response.result === 'OK' && closeOnSuccess) {
        window.close();
      }
    } catch (error) {
      console.error(error);
      setStatus(getReadableErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const sendPing = async () => {
    if (loading()) return;

    const connection = selectedConnection();
    if (!connection) {
      setStatus('✗ Keine Verbindung ausgewählt');
      return;
    }

    setStatus('');
    setLoading(true);
    try {
      await sendJsonRpc(connection, {
        jsonrpc: '2.0',
        method: 'JSONRPC.Ping',
        id: 1,
        params: {}
      });
      setStatus('✓ Verbindung erfolgreich');
    } catch (error) {
      console.error(error);
      setStatus(getReadableErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const sendToKodi = () => {
    executeRequest({
      jsonrpc: '2.0',
      method: 'Player.Open',
      id: 0,
      params: {
        item: { file: `plugin://plugin.video.sendtokodi/?${url()}` }
      }
    }, true);
  };

  const buildQueuePluginUrl = ({
    mediaUrl,
    title
  }: {
    mediaUrl: string;
    title?: string;
  }) => {
    const params = new URLSearchParams({
      action: 'queue',
      url: mediaUrl
    });

    const trimmedTitle = title?.trim();
    if (trimmedTitle) {
      params.set('title', trimmedTitle);
    }

    return `plugin://plugin.video.sendtokodi/?${params.toString()}`;
  };

  const addToQueue = () => {
    const file = buildQueuePluginUrl({
      mediaUrl: url(),
      title: title()
    });

    executeRequest({
      jsonrpc: '2.0',
      method: 'Player.Open',
      id: 0,
      params: {
        item: { file }
      }
    });
  };

  const stop = () => {
    executeRequest({
      jsonrpc: '2.0',
      method: 'Player.Stop',
      id: 0,
      params: { playerid: 1 }
    });
  };

  const openSettings = () => {
    if (chrome?.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    }
  };

  onMount(() => {
    if (chrome?.tabs) {
      chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        setUrl(tabs[0]?.url ?? '');
        setTitle(tabs[0]?.title ?? '');
      });
    }
  });

  return (
    <ApiContext.Provider value={{
      loading,
      url,
      setUrl,
      status,
      sendPing,
      sendToKodi,
      addToQueue,
      stop
    }}>
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