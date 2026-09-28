import type { JSX } from 'solid-js';
import { t } from '../utils/i18n';
import { ConnectionManager } from './ConnectionManager';
import { Form } from './Form';
import { InfoIcon } from './icons';

const Step = (props: { number: number; children: string | JSX.Element }) => (
  <li class="flex items-start">
    <span class="mr-2 font-bold text-kodi-blue">{props.number}.</span>
    <span>{props.children}</span>
  </li>
);

export const Settings = () => (
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <main class="mx-auto max-w-3xl px-4">
      <header class="mb-8 text-center">
        <h1 class="mb-2 text-4xl font-bold text-white">{t('settingsTitle')}</h1>
        <p class="text-gray-400">{t('settingsSubtitle')}</p>
      </header>

      <section class="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50 p-6 shadow-2xl">
        <ConnectionManager />
        <Form />
      </section>

      <section class="mt-6 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 p-6">
        <div class="flex items-start space-x-3">
          <InfoIcon class="mt-0.5 h-6 w-6 flex-shrink-0 text-kodi-blue" />
          <div class="flex-1">
            <h2 class="mb-3 text-lg font-semibold text-white">{t('httpRemoteTitle')}</h2>
            <ol class="space-y-2 text-sm text-gray-300">
              <Step number={1}>
                {t('httpRemoteStep1')} <span class="font-medium text-white">{t('httpRemoteStep1Path')}</span>
              </Step>
              <Step number={2}>
                {t('httpRemoteStep2')} <span class="font-medium text-white">"{t('httpRemoteStep2Setting')}"</span>
              </Step>
              <Step number={3}>{t('httpRemoteStep3')}</Step>
              <Step number={4}>{t('httpRemoteStep4')}</Step>
            </ol>
            <p class="mt-4 text-sm text-gray-400">{t('hintShortcuts')}</p>
          </div>
        </div>
      </section>

      <footer class="mt-8 text-center text-sm text-gray-500">
        <p>{t('footerText')}</p>
      </footer>
    </main>
  </div>
);
