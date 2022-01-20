# SendToKodi

:tv: Send almost every stream from Chrome to Kodi with SendToKodi

## Features

- Send various streams to Kodi
- Playlists
- Save multiple Connections
- [Supported Sites](https://rg3.github.io/youtube-dl/supportedsites.html)

## Requirements

To use this extension your need to install SendToKodi Addon in Kodi
[plugin.video.sendtokodi](https://github.com/firsttris/plugin.video.sendtokodi)

## Install

[Go to Chrome Webstore](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)

## Development

1. Clone `git clone https://github.com/firsttris/chrome.sendtokodi.git`
1. Install `npm install / yarn`
1. Run `npm run start / yarn start`
   - prefix with `TARGET_PLATFORM=firefox ` for Firefox compatibility
1. Load your extension:
   - Chrome
     1. Access `chrome://extensions/`
     1. Check `Developer mode`
     1. Click on `Load unpacked extension`
     1. Select the `build` folder
   - Firefox
     1. Access `about:debugging`
     1. Click `This Firefox`
     1. Click `Load temporary Add-on...`
     1. Select the `build` folder

## License
See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
