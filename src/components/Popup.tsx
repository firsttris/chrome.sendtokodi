import { createSignal } from 'solid-js';
import { SelectOne } from './SelectOne';
import { Form } from './Form';
import { useApi } from './../provider/ApiProvider';
import { useStore } from './../provider/StoreProvider';
import { t } from '../utils/i18n';

type ButtonProps = { loading: boolean, onClick: () => void, icon: string, label: string }

const Button = (props: ButtonProps) => (
  <button 
    class="btn-icon w-full h-8" 
    disabled={props.loading} 
    onClick={() => props.onClick()}
    title={props.label}
  >
    {props.loading ? (
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" innerHTML={props.icon}></svg>
    )}
  </button>
);

export const Popup = () => {

  const { loading, sendToKodi, addToQueue, setUrl, url, stop, status } = useApi();
  const { createNewConnection, deleteConnection } = useStore();
  const [settingsMode, setSettingsMode] = createSignal(false);

  const handleInputChange = (event: Event) => {
    setUrl((event.target as HTMLTextAreaElement).value);
  };

  return (
    <div class="w-[340px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div class="p-3 max-h-[580px] overflow-y-auto">
        {/* Header */}
        <div class="mb-2.5 flex items-center justify-between gap-2">
          <button
            class="btn-icon h-8 w-8"
            title={settingsMode() ? t('appTitle') : t('settingsSubtitle')}
            onClick={() => setSettingsMode(!settingsMode())}
          >
            {settingsMode() ? (
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317a1 1 0 011.35-.936l.094.046 1.578.79a1 1 0 00.894 0l1.578-.79a1 1 0 011.444.858l.005.078.09 1.764a1 1 0 00.62.86l1.62.648a1 1 0 01.578 1.285l-.033.082-.79 1.578a1 1 0 000 .894l.79 1.578a1 1 0 01-.858 1.444l-.078.005-1.764.09a1 1 0 00-.86.62l-.648 1.62a1 1 0 01-1.285.578l-.082-.033-1.578-.79a1 1 0 00-.894 0l-1.578.79a1 1 0 01-1.444-.858l-.005-.078-.09-1.764a1 1 0 00-.62-.86l-1.62-.648a1 1 0 01-.578-1.285l.033-.082.79-1.578a1 1 0 000-.894l-.79-1.578a1 1 0 01.858-1.444l.078-.005 1.764-.09a1 1 0 00.86-.62l.648-1.62z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
          <div class="text-center flex-1">
            <h2 class="text-lg font-bold text-white leading-tight">{t('appTitle')}</h2>
            <p class="text-xs text-gray-400">{settingsMode() ? t('settingsSubtitle') : t('appSubtitle')}</p>
          </div>
          {settingsMode() ? (
            <button
              class="btn-icon h-8 w-8"
              title="Open full settings"
              onClick={() => chrome.runtime.openOptionsPage()}
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 3h7v7" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14L21 3" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 14v7h-7" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10V3h7" />
              </svg>
            </button>
          ) : (
            <div class="h-8 w-8" aria-hidden="true"></div>
          )}
        </div>

        {settingsMode() ? (
          <>
            <div class="mb-2.5">
              <label class="block text-xs font-medium text-gray-300 mb-1.5">{t('activeConnection')}</label>
              <SelectOne compact />
            </div>
            <div class="grid grid-cols-2 gap-2 mb-2.5">
              <button
                class="btn-secondary flex items-center justify-center gap-2 text-xs"
                onClick={createNewConnection}
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                {t('btnNew')}
              </button>
              <button
                class="btn-danger flex items-center justify-center gap-2 text-xs"
                onClick={deleteConnection}
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                {t('btnDelete')}
              </button>
            </div>
            <Form />
          </>
        ) : (
          <>
            {/* URL Input */}
            <div class="mb-2.5">
              <label class="block text-xs font-medium text-gray-300 mb-1.5">
                {t('streamUrl')}
              </label>
              <textarea
                class="w-full px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-kodi-blue focus:border-transparent resize-none"
                rows={2}
                placeholder={t('streamUrlPlaceholder')}
                value={url()}
                onChange={handleInputChange}
              />
            </div>

            {/* Connection Selection */}
            <div class="mb-2.5">
              <label class="block text-xs font-medium text-gray-300 mb-1.5">
                {t('kodiConnection')}
              </label>
              <SelectOne compact />
            </div>

            {status() ? (
              <div class={`mb-2.5 rounded-lg border px-2.5 py-1.5 text-xs ${status().startsWith('✓') ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
                {status()}
              </div>
            ) : null}

            {/* Action Buttons */}
            <div class="grid grid-cols-3 gap-2">
              <Button
                loading={loading()}
                onClick={stop}
                icon='<rect x="8" y="8" width="8" height="8" rx="1" stroke-linecap="round" stroke-linejoin="round"/>'
                label={t('btnStop')}
              />
              <Button
                loading={loading()}
                onClick={addToQueue}
                icon='<path stroke-linecap="round" stroke-linejoin="round" d="M4 7h10M4 12h10M4 17h10"/><path stroke-linecap="round" stroke-linejoin="round" d="M17 12h3m-1.5-1.5v3"/>'
                label={t('btnQueue')}
              />
              <Button
                loading={loading()}
                onClick={sendToKodi}
                icon='<path stroke-linecap="round" stroke-linejoin="round" d="M8 6v12l10-6z"/>'
                label={t('btnPlay')}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};