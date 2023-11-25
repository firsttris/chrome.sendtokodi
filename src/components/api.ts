import { getSelectedConnection } from "./globalState";
import { createSignal, onMount } from 'solid-js';
import { Connection } from "./types";

export const [loading, setLoading] = createSignal(false);
export const [url, setUrl] = createSignal('');
export const [status, setStatus] = createSignal('');

interface Body {
  jsonrpc: string;
  method: string;
  id: number;
  params: any;
}

const createFetchOptions = (selectedConnection: Connection | undefined, body: Body) => ({
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization:
      'Basic ' +
      btoa(`${selectedConnection?.login}:${selectedConnection?.pw}`)
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

export const testConnection = async () => {
  const selectedConnection = getSelectedConnection();

  if (!selectedConnection) {
    console.error('No connection selected')
    return
  }

  try {
    const json = await fetchDataFromServer(selectedConnection, {
      method: 'Addons.GetAddonDetails',
      id: 0,
      jsonrpc: '2.0',
      params: { addonid: 'plugin.video.sendtokodi' }
    });

    if (json.error || json?.result?.addon?.addonid !== 'plugin.video.sendtokodi') {
      throw Error('Kodi Plugin not found');
    }

    setStatus('Connected');
  } catch (error) {
    setStatus((error as Error).message);
  }
};

export const sendToKodi = () => {
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

export const stop = () => {
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
