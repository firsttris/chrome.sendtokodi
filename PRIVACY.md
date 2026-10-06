# Privacy Policy for SendToKodi

_Last updated: October 6, 2026_

This privacy policy applies to the SendToKodi browser extension for Chrome and Firefox
(Chrome Web Store ID `gbcpfpcacakaadapjcdchbdmdnfbnbaf`), published by Tristan Teufel.

## Summary

SendToKodi does **not** collect, transmit, sell or share any personal data with the developer or any third party.
There is no tracking, no analytics and no server operated by the developer. Your browser talks directly to the Kodi device you configure.

## Data the extension processes

| Data | Purpose | Where it goes |
| --- | --- | --- |
| Kodi connection settings: name, address (IP/host), port, username, password, HTTPS on/off | To connect to your Kodi device | Stored in your browser's extension storage (`chrome.storage.sync`). If browser sync is turned on, your browser vendor (e.g. Google or Mozilla) syncs it between your own devices. It is never sent to the developer. |
| The URL of the current tab, a link or a video you choose to send | To play or queue it on Kodi | Sent only to the Kodi device you configured, and only when you click *Play*, *Queue*, a context menu entry or use a keyboard shortcut. |

The extension does not read the content of the web pages you visit, does not record your browsing history and does not use cookies.

## Permissions

- **Access to your Kodi's address** (optional host permission): to send commands to Kodi. Requested only for the address you enter.
- **Active tab**: to read the URL of the current tab, only after you click the extension icon or use a shortcut.
- **Context menus**: for *Play on Kodi* and *Add to Kodi queue*.
- **Storage**: to save your Kodi connections.

## Third parties

SendToKodi has no third-party services built in. What happens with a URL after it reaches Kodi (for example, the
[SendToKodi Kodi add-on](https://github.com/firsttris/plugin.video.sendtokodi) resolving it with yt-dlp) is outside the extension
and governed by Kodi and the add-ons you have installed.

## Deleting your data

Remove a connection in the extension's settings, or uninstall the extension. This deletes all data the extension has stored.

## Changes

Changes to this policy are published in this file. The history of all changes is visible in the Git log of this repository.

## Contact

Questions about privacy: open an issue at <https://github.com/firsttris/chrome.sendtokodi/issues>.
