import { createContext, onMount, useContext } from 'solid-js';
import { createSignal } from 'solid-js';
import { Connection } from "../components/types";
import { useStore } from "./StoreProvider";
import type { JSX } from 'solid-js';

interface Body {
  jsonrpc: string;
  method: string;
  id: number;
  params: any;
}

type Api = {
  loading: () => boolean;
  setLoading: (loading: boolean) => void;
  url: () => string;
  setUrl: (url: string) => void;
  status: () => string;
  setStatus: (status: string) => void;
  fetchDataFromServer: (selectedConnection: Connection | undefined, body: Body) => Promise<any>;
  testConnection: () => Promise<void>;
  stop: () => void;
  sendToKodi: () => void;
};

const ApiContext = createContext<Api>();

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

    if (!response.ok) {
      throw Error('Unauthorized');
    }

    return await response.json();
  };

  const testConnection = async () => {
    const selectedConnection = getSelectedConnection();

    if (!selectedConnection) {
      console.error('No connection selected')
      return
    }

    const body: Body = {
      jsonrpc: "2.0",
      method: "test",
      id: 1,
      params: {}
    };

    try {
      const response = await fetchDataFromServer(selectedConnection, body);
      console.log(response);
    } catch (error) {
      console.error(error);
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
    if (!isValid()) {
      return;
    }
    setLoading(true);
    try {
      const json = await fetchDataFromServer(selectedConnection, body);
      if (json.error) {
        throw Error(json.error);
      }
      if (json.result === 'OK' && close) {
        window.close();
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  const isValid = () => {
    const selectedConnection = getSelectedConnection();
    if (selectedConnection?.ip && selectedConnection?.port) {
      return true;
    }
    if(!chrome?.tabs) {
      return false;
    }
    chrome.tabs.create({ url: chrome.extension.getURL('options.html') });
    return false;
  };
  
  onMount(() => {
      if(!chrome?.tabs) {
        return;
      }
      chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
        setUrl(tabs[0].url ?? '');
      });
    });

  return (
    <ApiContext.Provider value={{ stop, sendToKodi, loading, setLoading, url, setUrl, status, setStatus, fetchDataFromServer, testConnection }}>
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