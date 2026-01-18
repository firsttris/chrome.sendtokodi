import { For } from "solid-js";
import { useStore } from './../provider/StoreProvider';

interface SelectOneProps {
  showLabel?: boolean;
}

export const SelectOne = (props: SelectOneProps) => {

  const { connections, selectedConnectionId, setSelectedConnectionId } = useStore();
  
  const handleInputChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value;
    setSelectedConnectionId(value);
  };

  return (
    <div>
      {props.showLabel ? <label for="connections" class="block text-sm font-medium text-gray-300 mb-2">Verbindung wählen</label> : null}
      <select
        class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-kodi-blue focus:border-transparent cursor-pointer"
        id="connections"
        onChange={handleInputChange}
        value={selectedConnectionId()}
      >
        <For each={connections()}>{(connection) => (
          <option value={connection.id} class="bg-gray-800" selected={connection.id === selectedConnectionId()}>
            {connection.name}
          </option>
        )}</For>
      </select>
    </div>
  );
};