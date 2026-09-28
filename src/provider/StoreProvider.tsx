import type { JSX } from 'solid-js';
import {
  batch,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js';
import { createEmptyConnection, isNameAvailable, loadState } from '../lib/connections';
import type { Connection } from '../lib/types';
import { t } from '../utils/i18n';

// chrome.storage.sync allows at most 120 writes per minute, so typing must not write on every keystroke.
const SAVE_DEBOUNCE_MS = 400;

type ConnectionField = Exclude<keyof Connection, 'id'>;

type Store = {
  loaded: () => boolean;
  connections: () => Connection[];
  selectedConnectionId: () => string | undefined;
  selectedConnection: () => Connection | undefined;
  setSelectedConnectionId: (id: string | undefined) => void;
  createNewConnection: () => void;
  deleteConnection: () => void;
  /** Returns false if the change was rejected (e.g. duplicate name). */
  updateConnection: <K extends ConnectionField>(attribute: K, value: Connection[K]) => boolean;
};

const StoreContext = createContext<Store>();

type StoreProviderProps = {
  children: JSX.Element;
};

export const StoreProvider = (props: StoreProviderProps) => {
  const [connections, setConnections] = createSignal<Connection[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = createSignal<string | undefined>();
  const [loaded, setLoaded] = createSignal(false);

  const selectedConnection = createMemo(() => connections().find((c) => c.id === selectedConnectionId()));

  const createNewConnection = () => {
    const newConnection = createEmptyConnection(
      t('newConnectionName'),
      connections().map((c) => c.name)
    );
    batch(() => {
      setConnections((prev) => [...prev, newConnection]);
      setSelectedConnectionId(newConnection.id);
    });
  };

  const deleteConnection = () => {
    const id = selectedConnectionId();
    if (!id) return;
    const remaining = connections().filter((c) => c.id !== id);
    if (remaining.length === 0) {
      // Keep at least one connection: reset instead of deleting the last one.
      const fresh = createEmptyConnection(t('newConnectionName'), []);
      batch(() => {
        setConnections([fresh]);
        setSelectedConnectionId(fresh.id);
      });
      return;
    }
    batch(() => {
      setConnections(remaining);
      setSelectedConnectionId(remaining[0].id);
    });
  };

  const updateConnection = <K extends ConnectionField>(attribute: K, value: Connection[K]) => {
    const id = selectedConnectionId();
    if (!id) return false;
    if (attribute === 'name' && (!String(value).trim() || !isNameAvailable(connections(), id, String(value)))) {
      return false;
    }
    setConnections((prev) => prev.map((c) => (c.id === id ? { ...c, [attribute]: value } : c)));
    return true;
  };

  onMount(async () => {
    try {
      const state = await loadState();
      batch(() => {
        setConnections(state.connections);
        setSelectedConnectionId(state.selectedConnectionId);
      });
    } catch (error) {
      console.error('Failed to load connections', error);
    }
    if (connections().length === 0) createNewConnection();
    setLoaded(true);
  });

  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  const save = () => {
    saveTimer = undefined;
    chrome.storage.sync
      .set({ connections: connections(), selectedConnectionId: selectedConnectionId() })
      .catch((error) => console.error('Failed to save connections', error));
  };

  createEffect(
    on([connections, selectedConnectionId, loaded], () => {
      if (!loaded()) return;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(save, SAVE_DEBOUNCE_MS);
    })
  );

  // Flush pending changes when the popup is closed.
  const flush = () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
      save();
    }
  };
  window.addEventListener('pagehide', flush);
  onCleanup(() => window.removeEventListener('pagehide', flush));

  return (
    <StoreContext.Provider
      value={{
        loaded,
        connections,
        selectedConnectionId,
        selectedConnection,
        setSelectedConnectionId,
        createNewConnection,
        deleteConnection,
        updateConnection,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
