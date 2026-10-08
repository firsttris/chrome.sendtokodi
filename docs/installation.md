---
description: Install the SendToKodi extension in Chrome, Firefox, Edge, Brave, Vivaldi, Opera or Firefox for Android, and the SendToKodi Kodi add-on it needs.
---

# Installation

SendToKodi is in all three extension stores. Install it from the store for your browser; updates arrive automatically.

| Browser | Store |
|---|---|
| **Chrome** | [Chrome Web Store](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf) |
| **Firefox** (desktop and Android) | [Mozilla Add-ons](https://addons.mozilla.org/firefox/addon/sendtokodi/) |
| **Edge** | [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/sendtokodi/cfaaejdnkempodfadjkjfblimmakeaij) |
| **Brave, Vivaldi, Opera, Arc** and other Chromium browsers | [Chrome Web Store](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf) (Opera may ask to install the *Install Chrome Extensions* add-on first) |

After installing, pin the SendToKodi icon to the toolbar (Chrome: the puzzle-piece icon → pin; Firefox: right-click
the toolbar → *Customize toolbar*) so the popup is one click away.

## Requirements

- **Firefox 140 or newer**, Firefox for Android 142 or newer. Chrome and Edge from the versions the stores offer the
  extension for (any current release).
- **Kodi 19 or newer** with the **SendToKodi Kodi add-on** installed, see below.
- The browser and Kodi have to reach each other over the network. Usually that means the same home network; see
  [Setup](setup.md#kodi-on-another-network) for other cases.

## The Kodi add-on

The extension sends a link; the **[SendToKodi Kodi add-on](https://github.com/firsttris/plugin.video.sendtokodi)**
on your Kodi device resolves the website with yt-dlp and plays it. Without the add-on, Kodi receives the request and
answers with an error.

Install it from the SendToKodi repository, which also keeps it up to date. The short version:

1. Download [repository.sendtokodi-1.0.0.zip](https://github.com/firsttris/repository.sendtokodi/raw/refs/heads/master/repository.sendtokodi-1.0.0.zip)
   to a place your Kodi can reach.
2. In Kodi: *Add-ons → Install from zip file* and pick the ZIP (allow *Unknown sources* once if Kodi asks).
3. *Add-ons → Install from repository → SendToKodi Repository → Video add-ons → SendToKodi → Install*.

The add-on's documentation has the
[full installation guide](https://firsttris.github.io/plugin.video.sendtokodi/installation.html), including the
first start, during which yt-dlp and the Deno JavaScript runtime are downloaded.

## Install from source

To run a development build or an unreleased version, build it yourself as described in
[Development](development.md) and load the `dist` folder as an unpacked extension. Store installs and unpacked
installs can coexist, but they keep separate settings.

## Updating and uninstalling

The stores update the extension automatically. To uninstall, right-click the icon and choose *Remove from Chrome* /
*Remove Extension*; this also deletes the saved connections. The Kodi add-on is uninstalled separately in Kodi.
