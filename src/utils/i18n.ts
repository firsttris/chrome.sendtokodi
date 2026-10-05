import { KodiError } from '../lib/kodi';

/**
 * Helper function for browser i18n
 * @param messageName - The name of the message in messages.json
 * @param substitutions - Optional substitutions for placeholders
 * @returns The localized message
 */
export const t = (messageName: string, substitutions?: string | string[]): string => {
  return chrome.i18n.getMessage(messageName, substitutions) || messageName;
};

export const errorMessage = (error: unknown) => {
  if (error instanceof KodiError) return t(`error_${error.code}`, error.detail);
  return t('error_unknown', (error as Error)?.message ?? String(error));
};
