import type { JSX } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import type { Action } from '../provider/ApiProvider';
import { useApi } from '../provider/ApiProvider';
import { useStore } from '../provider/StoreProvider';
import { t } from '../utils/i18n';
import { ConnectionManager } from './ConnectionManager';
import { Form, TestConnectionButton } from './Form';
import { BackIcon, ExternalIcon, GearIcon, PlayIcon, QueueIcon, Spinner, StopIcon } from './icons';
import { SelectOne } from './SelectOne';
import { StatusMessage } from './StatusMessage';
import { useShortcuts } from './shortcuts';
import { Alert, Button, Kbd, Label, Logo, Separator, Textarea } from './ui';

type ActionButtonProps = {
  action: Action;
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  variant: 'default' | 'outline';
  size: 'lg' | 'compact';
  class?: string;
  children?: JSX.Element;
};

const ActionButton = (props: ActionButtonProps) => {
  const { pending } = useApi();
  return (
    <Button
      variant={props.variant}
      size={props.size}
      class={props.class}
      disabled={!!pending()}
      aria-busy={pending() === props.action}
      onClick={() => props.onClick()}
    >
      {pending() === props.action ? <Spinner /> : props.icon}
      {props.label}
      {props.children}
    </Button>
  );
};

const HeaderButton = (props: { label: string; onClick: () => void; children: JSX.Element }) => (
  <Button variant="ghost" size="icon-sm" title={props.label} aria-label={props.label} onClick={() => props.onClick()}>
    {props.children}
  </Button>
);

export const Popup = () => {
  const { sendToKodi, addToQueue, setUrl, url, stop, status } = useApi();
  const { loaded, selectedConnection } = useStore();
  const shortcuts = useShortcuts();
  const [settingsMode, setSettingsMode] = createSignal(false);

  const needsSetup = () => loaded() && !selectedConnection()?.ip.trim();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendToKodi();
    }
  };

  return (
    <div class="flex w-[340px] flex-col bg-background">
      <header class="flex items-center gap-3 px-4 py-3.5">
        <Show when={settingsMode()} fallback={<Logo />}>
          <HeaderButton label={t('btnBack')} onClick={() => setSettingsMode(false)}>
            <BackIcon />
          </HeaderButton>
        </Show>
        <div class="min-w-0 flex-1">
          <h1 class="text-sm leading-tight font-semibold tracking-tight">
            {settingsMode() ? t('btnSettings') : t('appTitle')}
          </h1>
          <p class="text-xs text-muted-foreground">{settingsMode() ? t('settingsSubtitle') : t('appSubtitle')}</p>
        </div>
        <Show
          when={settingsMode()}
          fallback={
            <HeaderButton label={t('btnSettings')} onClick={() => setSettingsMode(true)}>
              <GearIcon />
            </HeaderButton>
          }
        >
          <HeaderButton label={t('btnOpenFullSettings')} onClick={() => chrome.runtime.openOptionsPage()}>
            <ExternalIcon />
          </HeaderButton>
        </Show>
      </header>

      <Separator />

      <div class="max-h-[500px] overflow-y-auto p-4">
        <Show
          when={!settingsMode()}
          fallback={
            <div class="flex flex-col gap-4">
              <ConnectionManager />
              <Separator />
              <Form />
              <TestConnectionButton class="w-full" />
              <StatusMessage status={status()} />
            </div>
          }
        >
          <div class="flex flex-col gap-4">
            <SelectOne id="connection-select" label={t('kodiConnection')} />

            <div class="flex flex-col gap-2">
              <Label for="stream-url">{t('streamUrl')}</Label>
              <Textarea
                id="stream-url"
                class="font-mono text-xs leading-relaxed"
                rows={3}
                placeholder={t('streamUrlPlaceholder')}
                value={url()}
                onInput={(event) => setUrl(event.currentTarget.value)}
                onKeyDown={handleKeyDown}
              />
              <p class="text-xs text-muted-foreground">{t('streamUrlHint')}</p>
            </div>

            <Show when={needsSetup()}>
              <Alert variant="warning" title={t('noConnectionConfigured')}>
                <Button variant="outline" size="sm" class="mt-1" onClick={() => setSettingsMode(true)}>
                  {t('openSettings')}
                </Button>
              </Alert>
            </Show>

            <StatusMessage status={status()} />

            <div class="flex flex-col gap-2">
              <ActionButton
                action="play"
                label={t('btnPlay')}
                icon={<PlayIcon />}
                onClick={sendToKodi}
                variant="default"
                size="lg"
                class="w-full"
              >
                <Show when={shortcuts()['play-current-tab']}>
                  {(shortcut) => (
                    <span class="ml-1">
                      <Kbd shortcut={shortcut()} variant="primary" />
                    </span>
                  )}
                </Show>
              </ActionButton>
              <div class="grid grid-cols-2 gap-2">
                <ActionButton
                  action="queue"
                  label={t('btnQueue')}
                  icon={<QueueIcon class="h-3.5 w-3.5" />}
                  onClick={addToQueue}
                  variant="outline"
                  size="compact"
                />
                <ActionButton
                  action="stop"
                  label={t('btnStop')}
                  icon={<StopIcon class="h-3.5 w-3.5" />}
                  onClick={stop}
                  variant="outline"
                  size="compact"
                />
              </div>
            </div>
          </div>
        </Show>
      </div>

      <Show when={!settingsMode()}>
        <Separator />
        <footer class="px-4 py-2.5 text-[11px] text-muted-foreground">{t('hintContextMenu')}</footer>
      </Show>
    </div>
  );
};
