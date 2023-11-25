import { For } from "solid-js";
import { useStore } from './../provider/StoreProvider';

interface SelectOneProps {
  showLabel?: boolean;
}

export const SelectOne = (props: SelectOneProps) => {

  const { getConnections, getSelectedConnection, setSelectedConnectionId } = useStore();
  
  const handleInputChange = (event: Event) => setSelectedConnectionId((event.target as HTMLSelectElement).value);

  return (
    <div>
      {props.showLabel ? <label for="connections">Select Connection</label> : null}
      <select
        class="form-control"
        id="connections"
        onChange={handleInputChange}
        value={getSelectedConnection()?.id}
      >
        <For each={getConnections()}>{(connection) => (
          <option value={connection.id}>
            {connection.name}
          </option>
        )}</For>
      </select>
    </div>
  );
};