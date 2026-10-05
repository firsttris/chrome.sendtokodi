import { Show } from 'solid-js';
import type { Status } from '../provider/ApiProvider';
import { Alert } from './ui';

export const StatusMessage = (props: { status: Status | undefined; class?: string }) => (
  <div role="status" aria-live="polite" class={props.class}>
    <Show when={props.status}>{(status) => <Alert variant={status().type} title={status().message} />}</Show>
  </div>
);
