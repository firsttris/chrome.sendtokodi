import { createContext, onMount, useContext } from 'solid-js';
import { createSignal } from 'solid-js';
import { Connection } from "../components/types";
import { useStore } from "./StoreProvider";
import type { JSX } from 'solid-js';

interface Body {
  jsonrpc: string;
  method: string;
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}

type ContextType = {
  loading: () => boolean;
  url: () => string;
  setUrl: (url: string) => void;
  status: () => string;
  testConnection: () => Promise<void>;
  stop: () => void;
  sendToKodi: () => void;
};

const ApiContext = createContext<ContextType>();

type StoreProviderProps = {
  children: JSX.Element;
};


export const ApiProvider = (props: StoreProviderProps) => {
  const [loading, setLoading] = createSignal(false);
  const [url, setUrl] = createSignal('');
  const [status, setStatus] = createSignal('');
  const { getSelectedConnection } = useStore();

  const createFetchOptions = (selectedConnection: Connection | undefined, body: Body) => ({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' +
        btoa(`${selectedConnection?.login}:${selectedConnection?.pw ?? ''}`)
    },
    body: JSON.stringify(body)
  });

  const fetchDataFromServer = async (selectedConnection: Connection | undefined, body: Body) => {
    const response = await fetch(
      `http://${selectedConnection?.ip}:${selectedConnection?.port}/jsonrpc`,
      createFetchOptions(selectedConnection, body)
    );
    const json = await response.json();
    if (json.error) {
      throw Error(json.error);
    }
    return json;
  };

  const testConnection = async () => {
    const selectedConnection = getSelectedConnection();

    if (!selectedConnection) {
      console.error('No connection selected')
      setStatus('No connection selected')
      return
    }

    const body: Body = {
      jsonrpc: "2.0",
      method: "test",
      id: 1,
      params: {}
    };

    try {
      const response = await fetchDataFromServer(selectedConnection, body)
      if (response.ok) {
        setStatus('Connection successful')
      }
    } catch (error) {
      console.log(error)
      setStatus((error as Error).message);
    }

  };

  const sendToKodi = () => {
    handleRequest(
      {
        jsonrpc: '2.0',
        method: 'Player.Open',
        id: 0,
        params: {
          item: {
            file: 'plugin://plugin.video.sendtokodi/?' + url()
          }
        }
      },
      true
    );
  };

  const stop = () => {
    handleRequest(
      {
        jsonrpc: '2.0',
        method: 'Player.Stop',
        params: { playerid: 1 },
        id: 0
      },
      false
    );
  };

  const handleRequest = async (body: Body, close: boolean) => {
    const selectedConnection = getSelectedConnection();
    if (!selectedConnection) {
      console.error('No connection selected')
      openSettings();
      return;
    }
    setLoading(true);
    try {
      const response = await fetchDataFromServer(selectedConnection, body);
      if (response.result === 'OK' && close) {
        window.close();
      }
    } catch (error) {
      console.log(error)
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const openSettings = () => {
    if (!chrome?.tabs) {
      return;
    }
    chrome.tabs.create({ url: chrome.extension.getURL('options.html') });
  };

  onMount(() => {
    if (!chrome?.tabs) {
      return;
    }
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      setUrl(tabs[0].url ?? '');
    });
  });

  return (
    <ApiContext.Provider value={{
      stop,
      sendToKodi,
      loading,
      url,
      setUrl,
      status,
      testConnection
    }}>
      {props.children}
    </ApiContext.Provider>
  );
}

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within a ApiProvider');
  }
  return context;
};