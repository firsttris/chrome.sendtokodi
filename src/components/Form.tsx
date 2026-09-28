import { createEffect, createSignal, on, Show } from 'solid-js';
import type { Connection } from '../lib/types';
import { useApi } from '../provider/ApiProvider';
import { useStore } from '../provider/StoreProvider';
import { t } from '../utils/i18n';
import { BoltIcon, Spinner } from './icons';
import { StatusMessage } from './StatusMessage';

type TextField = 'name' | 'ip' | 'port' | 'login' | 'pw';

type InputFieldProps = {
  name: TextField;
  type: string;
  placeholder: string;
  label: string;
  required?: boolean;
  inputMode?: 'text' | 'numeric';
  autocomplete?: string;
  validate?: (value: string) => string | undefined;
};

const validatePort = (value: string) => {
  const port = Number(value);
  return /^\d+$/.test(value.trim()) && port >= 1 && port <= 65535 ? undefined : t('fieldPortInvalid');
};

const InputField = (props: InputFieldProps) => {
  const { selectedConnection, selectedConnectionId, updateConnection } = useStore();
  const [touched, setTouched] = createSignal(false);
  // Holds input the store rejected (e.g. a duplicate name) so the user can keep editing it.
  const [draft, setDraft] = createSignal<string>();
  const [rejected, setRejected] = createSignal(false);

  createEffect(
    on(selectedConnectionId, () => {
      setTouched(false);
      setDraft(undefined);
      setRejected(false);
    })
  );

  const value = () => draft() ?? selectedConnection()?.[props.name] ?? '';

  const error = () => {
    if (rejected()) return value().trim() ? t('nameTaken') : t('fieldRequired');
    if (!value().trim()) return props.required && touched() ? t('fieldRequired') : undefined;
    return props.validate?.(value());
  };

  const handleInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    const accepted = updateConnection(props.name, event.currentTarget.value);
    setRejected(!accepted);
    setDraft(accepted ? undefined : event.currentTarget.value);
  };

  const inputId = () => `field-${props.name}`;

  return (
    <div class="mb-4">
      <label for={inputId()} class="mb-2 block text-sm font-medium text-gray-300">
        {props.label}
      </label>
      <input
        class={`input px-3 py-2 ${error() ? 'border-red-500' : ''}`}
        type={props.type}
        name={props.name}
        id={inputId()}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        autocomplete={props.autocomplete ?? 'off'}
        value={value()}
        aria-invalid={!!error()}
        aria-describedby={error() ? `${inputId()}-error` : undefined}
        onInput={handleInput}
        onBlur={() => setTouched(true)}
      />
      <Show when={error()}>
        <p id={`${inputId()}-error`} class="mt-1 text-xs text-red-400">
          {error()}
        </p>
      </Show>
    </div>
  );
};

export const Form = () => {
  const { pending, status, sendPing } = useApi();
  const { selectedConnection, updateConnection } = useStore();

  const setSecure = (secure: boolean) => updateConnection('secure' satisfies keyof Connection, secure);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendPing();
      }}
    >
      <InputField name="name" type="text" placeholder={t('fieldNamePlaceholder')} label={t('fieldName')} required />
      <InputField name="ip" type="text" placeholder={t('fieldIpPlaceholder')} label={t('fieldIp')} required />
      <InputField
        name="port"
        type="text"
        inputMode="numeric"
        placeholder={t('fieldPortPlaceholder')}
        label={t('fieldPort')}
        required
        validate={validatePort}
      />
      <InputField
        name="login"
        type="text"
        placeholder={t('fieldLoginPlaceholder')}
        label={t('fieldLogin')}
        autocomplete="username"
      />
      <InputField
        name="pw"
        type="password"
        placeholder={t('fieldPasswordPlaceholder')}
        label={t('fieldPassword')}
        autocomplete="current-password"
      />
      <label class="mb-4 flex cursor-pointer items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          class="h-4 w-4 rounded border-gray-600 bg-gray-800 accent-kodi-blue"
          checked={selectedConnection()?.secure ?? false}
          onChange={(event) => setSecure(event.currentTarget.checked)}
        />
        {t('fieldSecure')}
      </label>
      <div class="border-t border-gray-700 pt-4">
        <button type="submit" class="btn-primary flex items-center gap-2" disabled={!!pending()}>
          {pending() === 'ping' ? <Spinner /> : <BoltIcon />}
          {t('btnTest')}
        </button>
        <StatusMessage status={status()} class="mt-2" />
      </div>
    </form>
  );
};
