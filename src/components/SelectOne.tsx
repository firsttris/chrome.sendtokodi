import { useStore } from './../provider/StoreProvider';

interface SelectOneProps {
  showLabel?: boolean;
}

export const SelectOne = ({ showLabel = false }: SelectOneProps) => {

  const { getConnections, getSelectedConnection, setSelectedConnectionId } = useStore();
  
  const handleInputChange = (event: Event) => setSelectedConnectionId((event.target as HTMLSelectElement).value);

  return (
    <div>
      {showLabel ? <label for="connections">Select Connection</label> : null}
      <select
        class="form-control"
        id="connections"
        onChange={handleInputChange}
        value={getSelectedConnection()?.id}
      >
        {getConnections().map((connection) => (
          <option value={connection.id}>
            {connection.name}
          </option>
        ))}
      </select>
    </div>
  );
};