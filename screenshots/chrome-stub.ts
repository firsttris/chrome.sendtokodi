import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface Message {
  message: string;
  placeholders?: Record<string, { content: string }>;
}

/**
 * The parts of the extension API the popup and the options page use, for loading them as plain
 * pages: storage with two Kodi connections, the English messages, the active tab.
 * Returns a script for page.addInitScript.
 */
export const chromeStub = (activeTabUrl: string) => {
  const messages = JSON.parse(
    readFileSync(join(import.meta.dirname, '..', 'public', '_locales', 'en', 'messages.json'), 'utf8')
  ) as Record<string, Message>;
  const storage = {
    connections: [
      {
        id: 'living-room',
        name: 'Living room',
        ip: '192.168.1.100',
        port: '8080',
        login: 'kodi',
        pw: 'kodi1234',
        secure: false,
      },
      {
        id: 'bedroom',
        name: 'Bedroom',
        ip: '192.168.1.101',
        port: '8080',
        login: 'kodi',
        pw: 'kodi1234',
        secure: false,
      },
    ],
    selectedConnectionId: 'living-room',
  };

  return `(() => {
    const messages = ${JSON.stringify(messages)};
    const storage = ${JSON.stringify(storage)};
    const pick = (keys) => {
      if (keys == null) return { ...storage };
      const list = typeof keys === 'string' ? [keys] : Array.isArray(keys) ? keys : Object.keys(keys);
      return Object.fromEntries(list.filter((key) => key in storage).map((key) => [key, storage[key]]));
    };
    const noop = () => {};
    const event = { addListener: noop, removeListener: noop, hasListener: () => false };
    window.chrome = {
      storage: {
        sync: {
          get: async (keys) => pick(keys),
          set: async (items) => { Object.assign(storage, items); },
          remove: async () => {},
        },
        onChanged: event,
      },
      i18n: {
        getMessage: (name, substitutions) => {
          const entry = messages[name];
          if (!entry) return '';
          const subs = [].concat(substitutions ?? []);
          let text = entry.message.replace(/\\$(\\w+)\\$/g, (match, key) => entry.placeholders?.[key.toLowerCase()]?.content ?? match);
          return text.replace(/\\$(\\d)/g, (_, n) => subs[Number(n) - 1] ?? '');
        },
        getUILanguage: () => 'en',
      },
      tabs: { query: async () => [{ id: 1, url: ${JSON.stringify(activeTabUrl)} }] },
      runtime: { openOptionsPage: noop, getURL: (path) => path, onMessage: event, sendMessage: async () => {} },
      // As the manifest suggests them
      commands: {
        getAll: async () => [
          { name: 'play-current-tab', shortcut: 'Alt+Shift+K' },
          { name: 'queue-current-tab', shortcut: 'Alt+Shift+Q' },
        ],
        onCommand: event,
      },
      // Access to the Kodi hosts is granted
      permissions: { contains: async () => true, request: async () => true },
      action: { setBadgeText: noop, setBadgeBackgroundColor: noop, setTitle: noop },
    };
  })();`;
};
