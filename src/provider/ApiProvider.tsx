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
};

const ApiContext = createContext<Api>();

type ApiProviderProps = {
  children: JSX.Element;
};

export const ApiProvider = (props: ApiProviderProps) => {
  const [loading, setLoading] = createSignal(false);
  const [url, setUrl] = createSignal('');
  const [status, setStatus] = createSignal('');
  const { selectedConnection } = useStore();

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
    const connection = selectedConnection();
    if (!connection) {
      console.error('No connection selected');
      openSettings();
      return;
    }

    setLoading(true);
    try {
      const response = await sendJsonRpc(connection, body);
      if (response.result === 'OK' && closeOnSuccess) {
        window.close();
      }
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const sendPing = async () => {
    const connection = selectedConnection();
    if (!connection) {
      setStatus('Keine Verbindung ausgewählt');
      return;
    }

    try {
      const response = await sendJsonRpc(connection, {
        jsonrpc: '2.0',
        method: 'JSONRPC.Ping',
        id: 1,
        params: {}
      });
      setStatus('✓ Verbindung erfolgreich');
    } catch (error) {
      console.error(error);
      const message = (error as Error).message;
      if (message.includes('Failed to fetch')) {
        setStatus('✗ Verbindung fehlgeschlagen - Kodi nicht erreichbar');
      } else {
        setStatus(`✗ Fehler: ${message}`);
      }
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