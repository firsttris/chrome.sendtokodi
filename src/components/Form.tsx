import { createEffect, createSignal, on, Show } from 'solid-js';
import type { Connection } from '../lib/types';
import { useApi } from '../provider/ApiProvider';
import { useStore } from '../provider/StoreProvider';
import { t } from '../utils/i18n';
import { BoltIcon, Spinner } from './icons';
import { Button, Input, Label, Switch } from './ui';

export const CONNECTION_FORM_ID = 'connection-form';

type TextField = 'name' | 'ip' | 'port' | 'login' | 'pw';

type InputFieldProps = {
  name: TextField;
  type: string;
  placeholder: string;
  label: string;
  class: string;
  mono?: boolean;
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
    <div class={`flex min-w-0 flex-col gap-1.5 ${props.class}`}>
      <Label for={inputId()} invalid={!!error()}>
        {props.label}
      </Label>
      <Input
        class={props.mono ? 'font-mono text-xs' : ''}
        invalid={!!error()}
        type={props.type}
        name={props.name}
        id={inputId()}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        autocomplete={props.autocomplete ?? 'off'}
        value={value()}
        aria-describedby={error() ? `${inputId()}-error` : undefined}
        onInput={handleInput}
        onBlur={() => setTouched(true)}
      />
      <Show when={error()}>
        <p id={`${inputId()}-error`} class="text-xs text-destructive">
          {error()}
        </p>
      </Show>
    </div>
  );
};

/** The fields of the selected connection. Submitting the form (Enter or TestConnectionButton) tests the connection. */
export const Form = () => {
  const { sendPing } = useApi();
  const { selectedConnection, updateConnection } = useStore();

  const setSecure = (secure: boolean) => updateConnection('secure' satisfies keyof Connection, secure);

  return (
    <form
      id={CONNECTION_FORM_ID}
      class="grid grid-cols-6 gap-x-3 gap-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        sendPing();
      }}
    >
      <InputField
        name="name"
        type="text"
        placeholder={t('fieldNamePlaceholder')}
        label={t('fieldName')}
        class="col-span-6"
        required
      />
      <InputField
        name="ip"
        type="text"
        placeholder={t('fieldIpPlaceholder')}
        label={t('fieldIp')}
        class="col-span-4"
        mono
        required
      />
      <InputField
        name="port"
        type="text"
        inputMode="numeric"
        placeholder={t('fieldPortPlaceholder')}
        label={t('fieldPort')}
        class="col-span-2"
        mono
        required
        validate={validatePort}
      />
      <InputField
        name="login"
        type="text"
        placeholder={t('fieldLoginPlaceholder')}
        label={t('fieldLogin')}
        class="col-span-3"
        autocomplete="username"
      />
      <InputField
        name="pw"
        type="password"
        placeholder={t('fieldPasswordPlaceholder')}
        label={t('fieldPassword')}
        class="col-span-3"
        autocomplete="current-password"
      />
      <div class="col-span-6 flex items-center gap-3 rounded-lg border border-border p-3">
        <label for="field-secure" class="min-w-0 flex-1 cursor-pointer">
          <span class="block text-[13px] font-medium">{t('fieldSecure')}</span>
          <span class="block text-xs text-muted-foreground">{t('fieldSecureHint')}</span>
        </label>
        <Switch
          id="field-secure"
          label={t('fieldSecure')}
          checked={selectedConnection()?.secure ?? false}
          onChange={setSecure}
        />
      </div>
    </form>
  );
};

export const TestConnectionButton = (props: { class?: string }) => {
  const { pending } = useApi();
  return (
    <Button
      type="submit"
      form={CONNECTION_FORM_ID}
      variant="secondary"
      size="md"
      class={props.class}
      disabled={!!pending()}
      aria-busy={pending() === 'ping'}
    >
      {pending() === 'ping' ? <Spinner class="h-3.5 w-3.5" /> : <BoltIcon class="h-3.5 w-3.5" />}
      {t('btnTest')}
    </Button>
  );
};
