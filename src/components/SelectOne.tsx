import { For } from 'solid-js';
import { useApi } from '../provider/ApiProvider';
import { useStore } from '../provider/StoreProvider';
import { t } from '../utils/i18n';

interface SelectOneProps {
  id: string;
  label: string;
  compact?: boolean;
}

const REACHABILITY = {
  online: { color: 'bg-emerald-400', label: 'statusOnline' },
  offline: { color: 'bg-rose-400', label: 'statusOffline' },
  unknown: { color: 'bg-gray-500', label: 'statusUnknown' },
} as const;

export const SelectOne = (props: SelectOneProps) => {
  const { connections, selectedConnectionId, setSelectedConnectionId } = useStore();
  const { reachability } = useApi();
  const indicator = () => REACHABILITY[reachability()];

  return (
    <div>
      <div class={`flex items-center justify-between ${props.compact ? 'mb-1.5' : 'mb-2'}`}>
        <label for={props.id} class={`block font-medium text-gray-300 ${props.compact ? 'text-xs' : 'text-sm'}`}>
          {props.label}
        </label>
        <span class="flex items-center gap-1.5 text-[11px] text-gray-400" title={t(indicator().label)}>
          <span class={`h-2 w-2 rounded-full ${indicator().color}`} aria-hidden="true" />
          <span class="sr-only">{t(indicator().label)}</span>
        </span>
      </div>
      <select
        class={`input cursor-pointer ${props.compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`}
        id={props.id}
        onChange={(event) => setSelectedConnectionId(event.currentTarget.value)}
        value={selectedConnectionId()}
      >
        <For each={connections()}>
          {(connection) => (
            <option value={connection.id} class="bg-gray-800" selected={connection.id === selectedConnectionId()}>
              {connection.name}
            </option>
          )}
        </For>
      </select>
    </div>
  );
};
