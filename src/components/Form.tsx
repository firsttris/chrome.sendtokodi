import { Connection } from './types';
import { useApi } from ".././provider/ApiProvider";
import { useStore } from './../provider/StoreProvider';
import { t } from '../utils/i18n';

type InputFieldProps = {
  name: keyof Connection;
  type: string;
  placeholder: string;
  label: string;
};

const InputField = (props: InputFieldProps) => {
  const { selectedConnection, updateConnection } = useStore();
  
  const handleInputChange = (event: Event) => {
    const htmlInputElement = (event.target as HTMLInputElement);
    updateConnection(htmlInputElement.name as keyof Connection, htmlInputElement.value);
  };

  const value = () => {
    const val = selectedConnection()?.[props.name];
    if (val) return val;
    if (props.name === 'port' && !val) {
      // Port-Standardwert in die Connection schreiben, wenn noch nicht vorhanden
      updateConnection('port', '8080');
      return '8080';
    }
    return '';
  };
  const isInvalid = () => !value() && props.name !== 'pw';

  return (
    <div class="mb-4">
      <label for={props.name} class="block text-sm font-medium text-gray-300 mb-2">{props.label}</label>
      <input
        class={`w-full px-3 py-2 bg-gray-800 border ${
          isInvalid() ? 'border-red-500' : 'border-gray-700'
        } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-kodi-blue focus:border-transparent`}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        id={props.name}
        value={value()}
        onChange={handleInputChange}
      />
      {isInvalid() && (
        <p class="mt-1 text-xs text-red-400">{t('fieldRequired')}</p>
      )}
    </div>
  );
};

export const Form = () => {
  
  const { status, sendPing: testConnection } = useApi();
  return (
    <div>
      <InputField name="name" type="text" placeholder={t('fieldNamePlaceholder')} label={t('fieldName')} />
      <InputField name="ip" type="text" placeholder={t('fieldIpPlaceholder')} label={t('fieldIp')} />
      <InputField name="port" type="text" placeholder={t('fieldPortPlaceholder')} label={t('fieldPort')} />
      <InputField name="login" type="text" placeholder={t('fieldLoginPlaceholder')} label={t('fieldLogin')} />
      <InputField name="pw" type="password" placeholder={t('fieldPasswordPlaceholder')} label={t('fieldPassword')} />
      <div class="pt-4 border-t border-gray-700">
        <button class="btn-primary flex items-center gap-2" onClick={testConnection}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          {t('btnTest')}
        </button>
        {status() && (
          <div class="mt-2 text-sm font-medium">
            <span class={status()?.includes('✓') || status()?.includes('OK') ? 'text-green-400' : 'text-red-400'}>
              {status()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};