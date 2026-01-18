import { SelectOne } from './SelectOne';
import { useApi } from './../provider/ApiProvider';
import { t } from '../utils/i18n';

type ButtonProps = { loading: boolean, onClick: () => void, icon: string, label: string }

const Button = (props: ButtonProps) => (
  <button 
    class="btn-icon w-full" 
    disabled={props.loading} 
    onClick={() => props.onClick()}
    title={props.label}
  >
    {props.loading ? (
      <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" innerHTML={props.icon}></svg>
    )}
  </button>
);

export const Popup = () => {

  const { loading, sendToKodi, setUrl, url, stop } = useApi();

  const handleInputChange = (event: Event) => {
    setUrl((event.target as HTMLTextAreaElement).value);
  };

  return (
    <div class="w-[400px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div class="p-4">
        {/* Header */}
        <div class="mb-4 text-center">
          <h2 class="text-xl font-bold text-white">{t('appTitle')}</h2>
          <p class="text-xs text-gray-400">{t('appSubtitle')}</p>
        </div>

        {/* URL Input */}
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            {t('streamUrl')}
          </label>
          <textarea
            class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-kodi-blue focus:border-transparent resize-none"
            rows={3}
            placeholder={t('streamUrlPlaceholder')}
            value={url()}
            onChange={handleInputChange}
          />
        </div>

        {/* Connection Selection */}
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            {t('kodiConnection')}
          </label>
          <SelectOne />
        </div>

        {/* Action Buttons */}
        <div class="grid grid-cols-2 gap-3">
          <Button 
            loading={loading()} 
            onClick={stop} 
            icon='<rect x="8" y="8" width="8" height="8" rx="1" stroke-linecap="round" stroke-linejoin="round"/>'
            label={t('btnStop')}
          />
          <Button 
            loading={loading()} 
            onClick={sendToKodi} 
            icon='<path stroke-linecap="round" stroke-linejoin="round" d="M8 6v12l10-6z"/>'
            label={t('btnPlay')}
          />
        </div>
      </div>
    </div>
  );
};