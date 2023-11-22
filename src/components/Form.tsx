import React, { useState, useEffect, ChangeEvent } from 'react';
import { Connection } from './types';

type FormProps = {
  saveSelectedConnection: (connection: Connection, presist: boolean) => void;
  saveForm: () => void;
  selectedConnection: Connection;
};

export const Form: React.FC<FormProps> = ({ saveSelectedConnection, saveForm, selectedConnection }) => {
  const [status, setStatus] = useState('');

  const testConnection = async () => {
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
              btoa(`${selectedConnection.pw}:${selectedConnection.login}`)
          },
          body: JSON.stringify({
            method: 'Addons.GetAddonDetails',
            id: 0,
            jsonrpc: '2.0',
            params: { addonid: 'plugin.video.sendtokodi' }
          })
        }
      );

      if (!response.ok) {
        throw Error('Unauthorized');
      }

      const json = await response.json();

      if (json.error || json?.result?.addon?.addonid !== 'plugin.video.sendtokodi') {
        throw Error('Kodi Plugin not found');
      }

      setStatus('Connected');
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newConnection = { ...selectedConnection };
    newConnection[event.target.name as keyof Connection] = event.target.value;
    saveSelectedConnection(newConnection, true);
  };

  const isValid = () => {
    if (selectedConnection.name && selectedConnection.ip && selectedConnection.port) {
      return true;
    }
    return false;
  };

  const validAndSave = () => {
    if (isValid()) saveForm();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status !== '') {
      timer = setTimeout(() => setStatus(''), 5000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [status]);

  return (
    <div>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          className={'form-control' + (selectedConnection.name ? '' : ' is-invalid')}
          type="text"
          name="name"
          placeholder="Connection Name"
          id="name"
          value={selectedConnection.name}
          onChange={handleInputChange}
        />
        <div className="invalid-feedback">Please provide Name</div>
      </div>
      <div className="form-group">
        <label htmlFor="ip">IP Address</label>
        <input
          className={'form-control' + (selectedConnection.ip ? '' : ' is-invalid')}
          type="text"
          name="ip"
          placeholder="127.0.0.1"
          id="ip"
          value={selectedConnection.ip}
          onChange={handleInputChange}
        />
        <div className="invalid-feedback">Please provide IP Address</div>
      </div>
      <div className="form-group">
        <label htmlFor="port">Port</label>
        <input
          className={'form-control' + (selectedConnection.port ? '' : ' is-invalid')}
          type="text"
          name="port"
          placeholder="8080"
          id="port"
          value={selectedConnection.port}
          onChange={handleInputChange}
        />
        <div className="invalid-feedback">Please provide Port</div>
      </div>
      <div className="form-group">
        <label htmlFor="login">Login</label>
        <input
          className="form-control"
          type="text"
          name="login"
          placeholder="kodi"
          id="login"
          value={selectedConnection.login}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="pw">Password</label>
        <input
          className="form-control"
          type="password"
          name="pw"
          placeholder="kodi"
          id="pw"
          value={selectedConnection.pw}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-secondary" onClick={validAndSave}>
          Save
        </button>{' '}
        <button className="btn btn-secondary" onClick={testConnection}>
          Test
        </button>{' '}
        <p className="mt-3">{status}</p>
      </div>
    </div>
  );
};