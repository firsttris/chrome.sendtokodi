import React, { useState, useEffect } from 'react';
import { Settings } from './Settings';
import { Popup } from './Popup';
import { Connection } from './types';

const newConnection: Connection = {
  id: '',
  name: 'Default',
  ip: '',
  port: '',
  login: '',
  pw: ''
};

interface AppProps {
  page: string;
}

export const App: React.FC<AppProps> = ({ page }) => {
  const [connections, setConnections] = useState<Connection[]>([newConnection]);
  const [selectedConnection, setSelectedConnection] = useState<Connection>(newConnection);

  useEffect(() => {
    chrome.storage.sync.get('connections', result => {
      if (result.connections) {
        setConnections(result.connections);
      }
    });
    chrome.storage.sync.get('selectedConnection', result => {
      if (result.selectedConnection) {
        setSelectedConnection(result.selectedConnection);
      }
    });
  }, []);

  const saveSelectedConnection = (selectedConnection: Connection, persist: boolean) => {
    setSelectedConnection(selectedConnection);
    if (persist) {
      chrome.storage.sync.set({ selectedConnection });
    }
  }

  const saveSettings = (connections: Connection[], selectedConnection: Connection, persist: boolean) => {
    setConnections(connections);
    setSelectedConnection(selectedConnection);
    if (persist) {
      chrome.storage.sync.set({ connections, selectedConnection });
    }
  }

  return (
    <div>
      {page === '/options.html' ? (
        <Settings
          selectedConnection={selectedConnection}
          connections={connections}
          saveSelectedConnection={saveSelectedConnection}
          saveSettings={saveSettings}
        />
      ) : (
        <Popup
          selectedConnection={selectedConnection}
          connections={connections}
          saveSelectedConnection={saveSelectedConnection}
        />
      )}
    </div>
  );
}