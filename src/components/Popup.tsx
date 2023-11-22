import React, { useState, useEffect } from 'react';
import { SelectOne } from './SelectOne';
import { Connection } from './types';

interface PopupProps {
  selectedConnection: Connection;
  connections: Connection[];
  saveSelectedConnection: (selectedConnection: Connection, save: boolean) => void;
}

export const Popup: React.FC<PopupProps> = ({ selectedConnection, connections, saveSelectedConnection }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrl(event.target.value);
  };

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      setUrl(tabs[0].url ?? '');
    });
  }, []);

  const isValid = () => {
    if (selectedConnection.ip && selectedConnection.port) {
      return true;
    }
    chrome.tabs.create({ url: chrome.extension.getURL('options.html') });
    return false;
  };

  const sendToKodi = () => {
    post(
      {
        jsonrpc: '2.0',
        method: 'Player.Open',
        id: 0,
        params: {
          item: {
            file: 'plugin://plugin.video.sendtokodi/?' + url
          }
        }
      },
      true
    );
  };

  const stop = () => {
    post(
      {
        jsonrpc: '2.0',
        method: 'Player.Stop',
        params: { playerid: 1 },
        id: 0
      },
      false
    );
  };

  const post = async (body: any, close: boolean) => {
    if (!isValid()) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://${selectedConnection.ip}:${selectedConnection.port}/jsonrpc`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' +
              btoa(`${selectedConnection.login}:${selectedConnection.pw}`)
          },
          body: JSON.stringify(body)
        }
      );
      if (!response.ok) {
        throw Error('Unauthorized');
      }
      const json = await response.json();
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

  return (
    <div style={{ width: '300px' }}>
      <textarea
        className="form-control"
        rows={3}
        value={url}
        onChange={handleInputChange}
      />
      <div className="row m-1">
        <div className="col-7">
          <SelectOne
            connections={connections}
            selectedConnection={selectedConnection}
            saveSelectedConnection={saveSelectedConnection}
          />
        </div>
        <div className="col-5">
          <button
            className="btn btn-light"
            disabled={loading}
            onClick={sendToKodi}
          >
            {loading ? (
              <i className="fa fa-spinner fa-pulse fa-1x" />
            ) : (
              <i className="fa fa-play fa-1x" aria-hidden="true" />
            )}
          </button>
          <button
            className="btn btn-light"
            disabled={loading}
            onClick={stop}
          >
            <i className="fa fa-stop fa-1x" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};