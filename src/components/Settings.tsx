import { Form } from './Form';
import { SelectOne } from './SelectOne';
import { useStore } from './../provider/StoreProvider';
import { t } from '../utils/i18n';


export const Settings = () => {

  const { createNewConnection, deleteConnection } = useStore();

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div class="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div class="mb-8 text-center">
          <h1 class="text-4xl font-bold text-white mb-2">{t('settingsTitle')}</h1>
          <p class="text-gray-400">{t('settingsSubtitle')}</p>
        </div>

        {/* Connection Management Card */}
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div class="p-6">
            {/* Connection Selection */}
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {t('activeConnection')}
              </label>
              <SelectOne />
            </div>

            {/* Action Buttons */}
            <div class="grid grid-cols-2 gap-2 mb-6 pb-6 border-b border-gray-700">
              <button 
                class="btn-secondary flex items-center justify-center gap-2 text-sm"
                onClick={createNewConnection}
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                {t('btnNew')}
              </button>
              <button 
                class="btn-danger flex items-center justify-center gap-2 text-sm"
                onClick={deleteConnection}
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                {t('btnDelete')}
              </button>
            </div>

            {/* Connection Form */}
            <Form />
          </div>
        </div>

        {/* Kodi HTTP Remote Control Instructions */}
        <div class="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 backdrop-blur-sm rounded-xl p-6 mt-6 border border-blue-500/20">
          <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-kodi-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white mb-3">{t('httpRemoteTitle')}</h3>
              <ol class="space-y-2 text-sm text-gray-300">
                <li class="flex items-start">
                  <span class="text-kodi-blue font-bold mr-2">1.</span>
                  <span>{t('httpRemoteStep1')} <span class="font-medium text-white">{t('httpRemoteStep1Path')}</span></span>
                </li>
                <li class="flex items-start">
                  <span class="text-kodi-blue font-bold mr-2">2.</span>
                  <span>{t('httpRemoteStep2')} <span class="font-medium text-white">"{t('httpRemoteStep2Setting')}"</span></span>
                </li>
                <li class="flex items-start">
                  <span class="text-kodi-blue font-bold mr-2">3.</span>
                  <span>{t('httpRemoteStep3')} <span class="font-medium text-white">{t('httpRemoteStep3Port')}</span> ({t('httpRemoteStep3PortDefault')}), <span class="font-medium text-white">{t('httpRemoteStep3Username')}</span> {t('httpRemoteStep3Password').toLowerCase()}</span>
                </li>
                <li class="flex items-start">
                  <span class="text-kodi-blue font-bold mr-2">4.</span>
                  <span>{t('httpRemoteStep4')}</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div class="mt-8 text-center text-gray-500 text-sm">
          <p>{t('footerText')}</p>
        </div>
      </div>
    </div>
  );
};