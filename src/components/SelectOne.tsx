import type { JSX } from 'solid-js';
import { For } from 'solid-js';
import { useApi } from '../provider/ApiProvider';
import { useStore } from '../provider/StoreProvider';
import { t } from '../utils/i18n';
import { ChevronsUpDownIcon } from './icons';
import { Label } from './ui';

const REACHABILITY = {
  online: { color: 'bg-success', badge: 'badgeOnline', label: 'statusOnline' },
  offline: { color: 'bg-destructive', badge: 'badgeOffline', label: 'statusOffline' },
  unknown: { color: 'bg-zinc-500', badge: 'badgeUnknown', label: 'statusUnknown' },
} as const;

const useIndicator = () => {
  const { reachability } = useApi();
  return () => REACHABILITY[reachability()];
};

export const ReachabilityDot = (props: { class?: string }) => {
  const indicator = useIndicator();
  return (
    <span class={`h-1.5 w-1.5 shrink-0 rounded-full ${indicator().color} ${props.class ?? ''}`} aria-hidden="true" />
  );
};

export const ReachabilityBadge = () => {
  const indicator = useIndicator();
  return (
    <span
      class="inline-flex h-5 items-center gap-1.5 rounded-full border border-border px-2 text-[11px] font-medium text-zinc-300"
      title={t(indicator().label)}
    >
      <ReachabilityDot />
      {t(indicator().badge)}
      <span class="sr-only">{t(indicator().label)}</span>
    </span>
  );
};

/** Connection picker with a reachability badge; `children` are placed next to the select (e.g. buttons). */
export const SelectOne = (props: { id: string; label: string; children?: JSX.Element }) => {
  const { connections, selectedConnectionId, setSelectedConnectionId } = useStore();

  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <Label for={props.id}>{props.label}</Label>
        <ReachabilityBadge />
      </div>
      <div class="flex gap-2">
        <div class="relative min-w-0 flex-1">
          <ReachabilityDot class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2" />
          <select
            class="h-9 w-full cursor-pointer appearance-none truncate rounded-lg border border-input bg-input/30 pr-9 pl-7 text-[13px] font-medium text-foreground"
            id={props.id}
            onChange={(event) => setSelectedConnectionId(event.currentTarget.value)}
            value={selectedConnectionId()}
          >
            <For each={connections()}>
              {(connection) => (
                <option value={connection.id} class="bg-muted" selected={connection.id === selectedConnectionId()}>
                  {connection.name}
                </option>
              )}
            </For>
          </select>
          <ChevronsUpDownIcon class="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
        {props.children}
      </div>
    </div>
  );
};
