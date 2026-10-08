---
description: Privacy and permissions of the SendToKodi browser extension. No tracking, no analytics, no server in between. Why it needs activeTab, storage, contextMenus and the optional host permission for your Kodi address, and what it stores.
---

# Privacy & permissions

SendToKodi collects **no data**. There is no tracking, no analytics, and no server operated by the developer. Your
browser talks directly to the Kodi device you configure, and to nothing else.

## What the extension stores

| Data | Where | Why |
|---|---|---|
| Your Kodi connections: name, address, port, username, password, HTTPS on/off | The browser's extension storage (`chrome.storage.sync`). With browser sync on, your browser vendor syncs it between your own devices. | To connect to Kodi |
| The selected connection | Same | To remember the active device |

The password is stored as you entered it, because Kodi needs it in every request (HTTP basic authentication). It
never leaves your browser except in requests to the Kodi address you configured. Removing a connection or the
extension deletes the data.

## What the extension sends, and to whom

Only to your Kodi, and only when you act:

- The URL of the current tab, a link or a media element, when you click *Play* or *Add to Queue*, use a shortcut or a
  context menu entry.
- The link text or page title as the label for a queued item.
- A ping (`JSONRPC.Ping`) when the popup opens, to show whether Kodi is reachable.

Nothing is sent to the developer, to the extension stores or to any third party. The extension does not load remote
code or remote resources.

## Permissions

| Permission | Why | When |
|---|---|---|
| **Access to your Kodi's address** (optional host permission, for example `http://192.168.1.100/*`) | To send JSON-RPC requests to Kodi | Requested the first time you test a connection or play something, for that address only. The extension never asks for access to all websites. |
| **Active tab** (`activeTab`) | To read the URL and title of the current tab | Only after you click the icon or use a shortcut, for that tab, that one time |
| **Context menus** (`contextMenus`) | For *Play on Kodi* and *Add to Kodi queue* | |
| **Storage** (`storage`) | To save your connections | |

The extension does **not** request access to the websites you visit, cannot read their content, does not record
your browsing history and does not use cookies. Because the host permission is optional and asked per address, the
stores list the extension as needing no broad site access.

Firefox shows the same information under `about:addons` → SendToKodi → *Permissions*, where the granted Kodi
addresses can be revoked.

## Open source

All code is in the [GitHub repository](https://github.com/firsttris/chrome.sendtokodi), and the packages uploaded to
the stores are built from it by a [public workflow](releases.md). Mozilla reviews the source archive of every Firefox
release.

## Privacy policy

The formal privacy policy, as linked from the extension stores, is
[PRIVACY.md](https://github.com/firsttris/chrome.sendtokodi/blob/master/PRIVACY.md) in the repository. Its history is
visible in the Git log. Questions: [open an issue](https://github.com/firsttris/chrome.sendtokodi/issues).
