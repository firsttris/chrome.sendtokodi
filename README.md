# SendToKodi

SendToKodi is a Chrome extension that allows you to send almost any stream from your Browser to Kodi.

## Features

- Send various types of streams to Kodi
- Support for playlists
- Ability to save multiple connections
- [Supported Sites](https://github.com/yt-dlp/yt-dlp#supported-sites)

## Requirements

To use this extension, you need to install the SendToKodi Addon in Kodi. You can find it here: [plugin.video.sendtokodi](https://github.com/firsttris/plugin.video.sendtokodi)

## Installation

You can install the extension from:
- [Chrome Webstore](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)
- [Mozilla Store](https://addons.mozilla.org/firefox/addon/sendtokodi/)
- [Edge Store](https://microsoftedge.microsoft.com/addons/detail/sendtokodi/cfaaejdnkempodfadjkjfblimmakeaij)

## Configuration for Firefox

After installing the extension in Firefox, you need to configure permissions to allow access to all website URLs. This is required for the extension to function properly with all supported sites.

1. Open the Firefox Add-ons Manager by navigating to `about:addons`.
2. Locate the **SendToKodi** extension and click on the gear icon or the settings button.
3. Go to the **Permissions** tab.
4. Enable the option **Access your data for all websites**.

Here’s an example of how the permissions screen should look:

![Firefox Settings](./firefox-settings.png)

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

## Contributors

Thanks to all contributors who have helped improve SendToKodi:

- [@eeshugerman](https://github.com/eeshugerman) - Mozilla support [#3](https://github.com/firsttris/chrome.sendtokodi/pull/3)
- [@mauman](https://github.com/mauman) - Firefox manifest fixes [#14](https://github.com/firsttris/chrome.sendtokodi/pull/14)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
