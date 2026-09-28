import { loadSelectedConnection } from './lib/connections';
import * as kodi from './lib/kodi';
import { KodiError } from './lib/kodi';
import { errorMessage, t } from './utils/i18n';

type Mode = 'play' | 'queue';

type ContextType = `${chrome.contextMenus.ContextType}`;
const MENU_CONTEXTS: [ContextType, ...ContextType[]] = ['link', 'video', 'audio', 'page'];
const BADGE_RESET_MS = 4000;

const createMenus = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: 'play', title: t('menuPlay'), contexts: MENU_CONTEXTS });
    chrome.contextMenus.create({ id: 'queue', title: t('menuQueue'), contexts: MENU_CONTEXTS });
  });
};

let badgeTimer: ReturnType<typeof setTimeout> | undefined;
const showResult = async (ok: boolean, message: string) => {
  clearTimeout(badgeTimer);
  await chrome.action.setBadgeBackgroundColor({ color: ok ? '#10b981' : '#e11d48' });
  await chrome.action.setBadgeText({ text: ok ? '✓' : '!' });
  await chrome.action.setTitle({ title: `${t('extName')} – ${message}` });
  badgeTimer = setTimeout(() => {
    chrome.action.setBadgeText({ text: '' });
    chrome.action.setTitle({ title: t('extName') });
  }, BADGE_RESET_MS);
};

const send = async (mode: Mode, mediaUrl: string | undefined, title?: string) => {
  try {
    if (!mediaUrl || !/^https?:\/\//.test(mediaUrl)) throw new Error(t('noUrl'));
    const connection = await loadSelectedConnection();
    if (!connection?.ip.trim()) throw new KodiError('noHost');
    // Background contexts cannot prompt; the permission is granted from the popup or settings page.
    if (!(await kodi.hasHostPermission(connection))) throw new KodiError('permission');
    if (mode === 'play') await kodi.play(connection, mediaUrl);
    else await kodi.queue(connection, mediaUrl, title);
    await showResult(true, t(mode === 'play' ? 'successPlay' : 'successQueue'));
  } catch (error) {
    console.error(error);
    await showResult(false, errorMessage(error));
    if (error instanceof KodiError && (error.code === 'noHost' || error.code === 'permission')) {
      chrome.runtime.openOptionsPage();
    }
  }
};

chrome.runtime.onInstalled.addListener(createMenus);
chrome.runtime.onStartup.addListener(createMenus);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const mode = info.menuItemId === 'queue' ? 'queue' : 'play';
  const mediaUrl = info.linkUrl ?? info.srcUrl ?? info.pageUrl ?? tab?.url;
  const title = info.linkUrl ? info.selectionText : info.srcUrl ? undefined : tab?.title;
  send(mode, mediaUrl, title);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  const activeTab = tab ?? (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
  send(command === 'queue-current-tab' ? 'queue' : 'play', activeTab?.url, activeTab?.title);
});
