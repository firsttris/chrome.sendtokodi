import type { JSX } from 'solid-js';
import { For, Show } from 'solid-js';
import { useApi } from '../provider/ApiProvider';
import { useStore } from '../provider/StoreProvider';
import { t } from '../utils/i18n';
import { useConfirmDelete } from './ConnectionManager';
import { Form, TestConnectionButton } from './Form';
import { CheckIcon, PlusIcon, TrashIcon } from './icons';
import { ReachabilityBadge, ReachabilityDot } from './SelectOne';
import { StatusMessage } from './StatusMessage';
import { type Command, useShortcuts } from './shortcuts';
import { Button, Card, CardHeader, Kbd, Logo, Separator } from './ui';

const ConnectionList = () => {
  const { connections, selectedConnectionId, setSelectedConnectionId, createNewConnection } = useStore();

  return (
    <nav class="flex flex-col gap-1" aria-labelledby="connections-title">
      <h2 id="connections-title" class="px-2.5 pb-1.5 text-xs font-medium text-muted-foreground">
        {t('connectionsTitle')}
      </h2>
      <For each={connections()}>
        {(connection) => {
          const selected = () => connection.id === selectedConnectionId();
          return (
            <button
              type="button"
              aria-current={selected() ? 'true' : undefined}
              class={`flex h-9 items-center gap-2.5 rounded-md px-2.5 text-left text-[13px] transition-colors ${
                selected() ? 'bg-accent font-medium text-foreground' : 'text-zinc-300 hover:bg-accent/50'
              }`}
              onClick={() => setSelectedConnectionId(connection.id)}
            >
              <Show when={selected()} fallback={<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />}>
                <ReachabilityDot />
              </Show>
              <span class="min-w-0 flex-1 truncate">{connection.name}</span>
              <span class="font-mono text-[11px] text-muted-foreground">{connection.ip}</span>
            </button>
          );
        }}
      </For>
      <Button variant="outline" class="mt-2 border-dashed" onClick={createNewConnection}>
        <PlusIcon class="h-3.5 w-3.5" />
        {t('btnNewConnection')}
      </Button>
    </nav>
  );
};

const ConnectionCard = () => {
  const { selectedConnection } = useStore();
  const { status } = useApi();
  const { confirming, handleDelete } = useConfirmDelete();

  return (
    <Card>
      <div class="p-6 pb-0">
        <CardHeader title={selectedConnection()?.name ?? ''} description={t('connectionCardDescription')}>
          <ReachabilityBadge />
        </CardHeader>
      </div>
      <div class="p-6">
        <Form />
      </div>
      <div class="flex flex-wrap items-center gap-3 border-t border-border px-6 py-4">
        <Button variant={confirming() ? 'destructive' : 'destructive-outline'} onClick={handleDelete}>
          <TrashIcon class="h-3.5 w-3.5" />
          {confirming() ? t('btnDeleteConfirm') : t('btnDelete')}
        </Button>
        <span class="inline-flex flex-1 items-center gap-1.5 text-xs text-muted-foreground">
          <CheckIcon class="h-3.5 w-3.5" />
          {t('autoSaved')}
        </span>
        <TestConnectionButton />
      </div>
      <Show when={status()}>
        <StatusMessage status={status()} class="px-6 pb-5" />
      </Show>
    </Card>
  );
};

const Step = (props: { number: number; children: JSX.Element }) => (
  <li class="flex gap-3">
    <span class="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-zinc-700 text-[11px] font-semibold">
      {props.number}
    </span>
    <span>{props.children}</span>
  </li>
);

const HttpRemoteCard = () => (
  <Card class="flex flex-col gap-5 p-6">
    <CardHeader title={t('httpRemoteTitle')} description={t('httpRemoteSubtitle')} />
    <ol class="flex flex-col gap-3.5 text-[13px] leading-relaxed text-zinc-300">
      <Step number={1}>
        {t('httpRemoteStep1')}{' '}
        <code class="rounded bg-accent px-1.5 py-px font-mono text-xs text-foreground">{t('httpRemoteStep1Path')}</code>
      </Step>
      <Step number={2}>
        {t('httpRemoteStep2')} <strong class="font-medium text-foreground">"{t('httpRemoteStep2Setting')}"</strong>
      </Step>
      <Step number={3}>{t('httpRemoteStep3')}</Step>
      <Step number={4}>{t('httpRemoteStep4')}</Step>
    </ol>
  </Card>
);

const ShortcutRow = (props: { label: string; children: JSX.Element }) => (
  <div class="flex items-center gap-3 border-b border-border py-2.5 text-[13px] last:border-b-0">
    <span class="flex-1 text-zinc-300">{props.label}</span>
    {props.children}
  </div>
);

const ShortcutsCard = () => {
  const shortcuts = useShortcuts();
  const shortcut = (command: Command) => (
    <Show
      when={shortcuts()[command]}
      fallback={<span class="text-xs text-muted-foreground">{t('shortcutNotSet')}</span>}
    >
      {(keys) => <Kbd shortcut={keys()} />}
    </Show>
  );

  return (
    <Card class="flex flex-col gap-5 p-6">
      <CardHeader title={t('shortcutsTitle')} description={t('shortcutsSubtitle')} />
      <div class="flex flex-col">
        <ShortcutRow label={t('commandPlay')}>{shortcut('play-current-tab')}</ShortcutRow>
        <ShortcutRow label={t('commandQueue')}>{shortcut('queue-current-tab')}</ShortcutRow>
        <ShortcutRow label={t('contextMenuLabel')}>
          <span class="text-xs text-muted-foreground">{t('menuPlay')}</span>
        </ShortcutRow>
      </div>
      <p class="text-xs text-muted-foreground">{t('shortcutsHint')}</p>
    </Card>
  );
};

const HeaderLink = (props: { href: string; children: string }) => (
  <a
    href={props.href}
    target="_blank"
    rel="noreferrer"
    class="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
  >
    {props.children}
  </a>
);

export const Settings = () => (
  <div class="min-h-screen bg-background">
    <header class="border-b border-border">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-6 py-3.5">
        <Logo />
        <span class="flex-1 text-[15px] font-semibold">{t('appTitle')}</span>
        <HeaderLink href="https://github.com/firsttris/chrome.sendtokodi">GitHub</HeaderLink>
        <HeaderLink href="https://github.com/firsttris/plugin.video.sendtokodi">{t('kodiAddon')}</HeaderLink>
      </div>
    </header>

    <main class="mx-auto flex max-w-5xl flex-col gap-7 px-6 pt-10 pb-14">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">{t('btnSettings')}</h1>
        <p class="mt-1.5 text-[15px] text-muted-foreground">{t('settingsSubtitle')}</p>
      </div>
      <Separator />

      <div class="flex flex-wrap items-start gap-8">
        <aside class="w-full md:w-60">
          <ConnectionList />
        </aside>
        <div class="flex min-w-0 flex-1 basis-[560px] flex-col gap-6">
          <ConnectionCard />
          <div class="grid gap-6 lg:grid-cols-2">
            <HttpRemoteCard />
            <ShortcutsCard />
          </div>
        </div>
      </div>

      <footer class="pt-2 text-center text-xs text-muted-foreground">{t('footerText')}</footer>
    </main>
  </div>
);
