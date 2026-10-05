import { createSignal, onMount } from 'solid-js';

export type Command = 'play-current-tab' | 'queue-current-tab';

/** The keyboard shortcuts currently assigned to the extension's commands (users can change them). */
export const useShortcuts = () => {
  const [shortcuts, setShortcuts] = createSignal<Partial<Record<Command, string>>>({});
  onMount(async () => {
    try {
      const commands = await chrome.commands.getAll();
      setShortcuts(Object.fromEntries(commands.filter((c) => c.name && c.shortcut).map((c) => [c.name, c.shortcut])));
    } catch (error) {
      console.error('Failed to read shortcuts', error);
    }
  });
  return shortcuts;
};
