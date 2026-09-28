import type { JSX } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import type { Action } from '../provider/ApiProvider';
import { useApi } from '../provider/ApiProvider';
import { useStore } from '../provider/StoreProvider';
import { t } from '../utils/i18n';
import { ConnectionManager } from './ConnectionManager';
import { Form } from './Form';
import { BackIcon, ExternalIcon, GearIcon, PlayIcon, QueueIcon, Spinner, StopIcon } from './icons';
import { SelectOne } from './SelectOne';
import { StatusMessage } from './StatusMessage';

type ActionButtonProps = {
  action: Action;
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  class: string;
};

const ActionButton = (props: ActionButtonProps) => {
  const { pending } = useApi();
  return (
    <button
      type="button"
      class={`flex items-center justify-center gap-2 ${props.class}`}
      disabled={!!pending()}
      aria-busy={pending() === props.action}
      onClick={() => props.onClick()}
    >
      {pending() === props.action ? <Spinner /> : props.icon}
      {props.label}
    </button>
  );
};

const HeaderButton = (props: { label: string; onClick: () => void; children: JSX.Element }) => (
  <button
    type="button"
    class="btn-ghost h-8 w-8"
    title={props.label}
    aria-label={props.label}
    onClick={() => props.onClick()}
  >
    {props.children}
  </button>
);

export const Popup = () => {
  const { sendToKodi, addToQueue, setUrl, url, stop, status } = useApi();
  const { loaded, selectedConnection } = useStore();
  const [settingsMode, setSettingsMode] = createSignal(false);

  const needsSetup = () => loaded() && !selectedConnection()?.ip.trim();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendToKodi();
    }
  };

  return (
    <div class="w-[340px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div class="max-h-[580px] overflow-y-auto p-3">
        <header class="mb-3 flex items-center justify-between gap-2">
          <HeaderButton
            label={settingsMode() ? t('btnBack') : t('btnSettings')}
            onClick={() => setSettingsMode(!settingsMode())}
          >
            {settingsMode() ? <BackIcon /> : <GearIcon />}
          </HeaderButton>
          <div class="flex-1 text-center">
            <h1 class="text-lg font-bold leading-tight text-white">{t('appTitle')}</h1>
            <p class="text-xs text-gray-400">{settingsMode() ? t('settingsSubtitle') : t('appSubtitle')}</p>
          </div>
          <Show when={settingsMode()} fallback={<div class="h-8 w-8" aria-hidden="true" />}>
            <HeaderButton label={t('btnOpenFullSettings')} onClick={() => chrome.runtime.openOptionsPage()}>
              <ExternalIcon />
            </HeaderButton>
          </Show>
        </header>

        <Show
          when={!settingsMode()}
          fallback={
            <>
              <ConnectionManager compact />
              <Form />
            </>
          }
        >
          <div class="mb-3">
            <label for="stream-url" class="mb-1.5 block text-xs font-medium text-gray-300">
              {t('streamUrl')}
            </label>
            <textarea
              id="stream-url"
              class="input resize-none px-2.5 py-1.5 text-xs"
              rows={3}
              placeholder={t('streamUrlPlaceholder')}
              value={url()}
              onInput={(event) => setUrl(event.currentTarget.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div class="mb-3">
            <SelectOne id="connection-select" label={t('kodiConnection')} compact />
          </div>

          <Show when={needsSetup()}>
            <div class="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-300">
              {t('noConnectionConfigured')}{' '}
              <button type="button" class="font-medium underline" onClick={() => setSettingsMode(true)}>
                {t('openSettings')}
              </button>
            </div>
          </Show>

          <StatusMessage status={status()} class={status() ? 'mb-3' : ''} />

          <ActionButton
            action="play"
            label={t('btnPlay')}
            icon={<PlayIcon />}
            onClick={sendToKodi}
            class="btn-primary mb-2 w-full py-2.5 text-sm"
          />
          <div class="grid grid-cols-2 gap-2">
            <ActionButton
              action="queue"
              label={t('btnQueue')}
              icon={<QueueIcon />}
              onClick={addToQueue}
              class="btn-secondary px-2 py-1.5 text-xs"
            />
            <ActionButton
              action="stop"
              label={t('btnStop')}
              icon={<StopIcon />}
              onClick={stop}
              class="btn-secondary px-2 py-1.5 text-xs"
            />
          </div>
        </Show>
      </div>
    </div>
  );
};
