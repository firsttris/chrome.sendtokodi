import React, { useState } from 'react';
import { Form } from './Form';
import { SelectOne } from './SelectOne';
import { Connection } from './types';

type SettingsProps = {
  saveSelectedConnection: (connection: Connection, persist: boolean) => void,
  saveSettings: (connections: Connection[], selectedConnection: Connection, persist: boolean) => void,
  selectedConnection: Connection,
  connections: Connection[]
};

const newConnection: Connection = {
  id: '',
  name: 'Default',
  ip: '',
  port: '',
  login: '',
  pw: ''
};

export const Settings: React.FC<SettingsProps> = (props) => {
  const [connections, setConnections] = useState<Connection[]>(props.connections);
  const [selectedConnection, setSelectedConnection] = useState<Connection>(props.selectedConnection);

  const saveForm = () => {
    const index = connections.findIndex(connection => connection.id === selectedConnection.id);
    connections[index] = selectedConnection;
    props.saveSettings(connections, selectedConnection, true);
  };

  const create = () => {
    newConnection.id = new Date().getTime().toString();
    const newConnections = [newConnection, ...connections];
    setConnections(newConnections);
    props.saveSettings(newConnections, newConnection, false);
  };

  const deleteConnection = () => {
    if (connections.length < 2) {
      setConnections([newConnection]);
      setSelectedConnection(newConnection);
    } else {
      const index = connections.findIndex(connection => connection.id === selectedConnection.id);
      const newConnections = [...connections];
      newConnections.splice(index, 1);
      setConnections(newConnections);
      setSelectedConnection(newConnections[0]);
    }
    props.saveSettings(connections, selectedConnection, true);
  };

  return (
    <div className="container mt-3" style={{ width: '500px' }}>
      <div className="form-group">
        <SelectOne
          connections={connections}
          selectedConnection={selectedConnection}
          saveSelectedConnection={props.saveSelectedConnection}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-secondary" onClick={create}>
          New
        </button>{' '}
        <button className="btn btn-secondary" onClick={deleteConnection}>
          Delete
        </button>
      </div>
      <Form
        selectedConnection={selectedConnection}
        saveSelectedConnection={props.saveSelectedConnection}
        saveForm={saveForm}
      />
    </div>
  );
};