/**
 * Helper function for Chrome i18n
 * @param messageName - The name of the message in messages.json
 * @param substitutions - Optional substitutions for placeholders
 * @returns The localized message
 */
export const t = (messageName: string, substitutions?: string | string[]): string => {
  return chrome.i18n.getMessage(messageName, substitutions) || messageName;
};
