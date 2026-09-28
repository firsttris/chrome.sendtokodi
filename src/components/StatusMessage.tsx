import { Show } from 'solid-js';
import type { Status } from '../provider/ApiProvider';

export const StatusMessage = (props: { status: Status | undefined; class?: string }) => (
  <div role="status" aria-live="polite" class={props.class}>
    <Show when={props.status}>
      {(status) => (
        <div
          class={`rounded-lg border px-2.5 py-1.5 text-xs ${
            status().type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          {status().message}
        </div>
      )}
    </Show>
  </div>
);
