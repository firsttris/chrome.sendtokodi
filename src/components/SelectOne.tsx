import React from 'react';
import { Connection } from './types';

interface SelectOneProps {
  connections: Connection[];
  saveSelectedConnection: (connection: Connection, presist: boolean) => void;
  selectedConnection: Connection;
  showLabel?: boolean;
}

export const SelectOne: React.FC<SelectOneProps> = ({ connections, saveSelectedConnection, selectedConnection, showLabel = false }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const index = event.target.selectedIndex;
    let selectedConnection = { ...connections[index] };
    saveSelectedConnection(selectedConnection, true);
  };

  return (
    <div>
      {showLabel ? <label htmlFor="connections">Select Connection</label> : null}
      <select
        className="form-control"
        id="connections"
        onChange={handleInputChange}
        value={selectedConnection.name}
      >
        {connections.map((connection, index) => (
          <option key={index} value={connection.name}>
            {connection.name}
          </option>
        ))}
      </select>
    </div>
  );
};
