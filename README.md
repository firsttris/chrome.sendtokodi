# SendToKodi

SendToKodi is a Chrome extension that allows you to send almost any stream from Chrome to Kodi.

## Features

- Send various types of streams to Kodi
- Support for playlists
- Ability to save multiple connections
- [Supported Sites](https://rg3.github.io/youtube-dl/supportedsites.html)

## Requirements

To use this extension, you need to install the SendToKodi Addon in Kodi. You can find it here: [plugin.video.sendtokodi](https://github.com/firsttris/plugin.video.sendtokodi)

## Installation

You can install the extension from:
- [Chrome Webstore](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)
- [Mozilla Store](https://addons.mozilla.org/firefox/addon/sendtokodi/)
- [Edge Store](https://microsoftedge.microsoft.com/addons/detail/sendtokodi/cfaaejdnkempodfadjkjfblimmakeaij)

## Development

Follow these steps to get the extension ready for development:

1. Install the necessary packages with `npm install`.
2. Start the project with `npm run start`.
   - For Firefox compatibility, use `npm run start:firefox`.
3. Load your extension:
   - For Chrome:
     1. Go to `chrome://extensions/`.
     2. Enable `Developer mode`.
     3. Click on `Load unpacked extension`.
     4. Select the `build` folder.
   - For Firefox:
     1. Go to `about:debugging`.
     2. Click on `This Firefox`.
     3. Click on `Load temporary Add-on...`.
     4. Select the `build` folder.

## Thanks to Our Contributors

- thanks to [eeshugerman](https://github.com/eeshugerman) for providing Mozilla support [3](https://github.com/firsttris/chrome.sendtokodi/pull/3)

## License

For license rights and limitations, see the [LICENSE](LICENSE.md) file (MIT).
