<div align="center">

  # SendToKodi
  <img src="./store-assets/banner/1280x800.png" alt="SendToKodi Banner" width="100%" />

  [![Check Build](https://github.com/firsttris/chrome.sendtokodi/actions/workflows/check_build.yml/badge.svg)](https://github.com/firsttris/chrome.sendtokodi/actions/workflows/check_build.yml)
  [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/gbcpfpcacakaadapjcdchbdmdnfbnbaf?label=Chrome&logo=google-chrome)](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)
  [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/gbcpfpcacakaadapjcdchbdmdnfbnbaf?label=Chrome%20Users)](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)
  [![Mozilla Add-on](https://img.shields.io/amo/v/sendtokodi?label=Firefox&logo=firefox)](https://addons.mozilla.org/firefox/addon/sendtokodi/)
  [![Mozilla Add-on Users](https://img.shields.io/amo/users/sendtokodi?label=Firefox%20Users)](https://addons.mozilla.org/firefox/addon/sendtokodi/)

  **Watch it in the browser, play it on the big screen.**<br>
  SendToKodi sends videos from YouTube, Vimeo, Twitch and [1000+ other websites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) to Kodi with a single click.

  [Install](#-install) · [Setup](#-setup-in-3-steps) · [Usage](#-usage) · [Troubleshooting](#-troubleshooting) · [Privacy](#-privacy--permissions)

</div>

<p align="center">
  <img src="./store-assets/screenshots/popup.png" alt="The SendToKodi popup with the current tab's URL and the Play button" width="300" />
  &nbsp;&nbsp;
  <img src="./store-assets/screenshots/popup-settings.png" alt="Connection settings in the popup" width="300" />
</p>

## ✨ Features

- 🎬 **One click to Kodi**: Open the popup on any video page and press **Play**. The URL of the current tab is already filled in.
- 📋 **Queue instead of interrupting**: Add videos to Kodi's playlist while something else is playing.
- 🖱️ **Context menu**: Right-click a link, video or page and choose **Play on Kodi** or **Add to Kodi queue**.
- ⌨️ **Keyboard shortcuts**: `Alt+Shift+K` plays the current tab, `Alt+Shift+Q` queues it, without opening the popup.
- 🔄 **Several Kodi devices**: Save a connection for each one (living room, bedroom, …) and switch between them.
- 🟢 **Connection status**: See at a glance whether your Kodi is reachable.
- 🌍 **English and German**, follows your browser language.
- 🔒 **Private**: No tracking and no servers in between. Your browser talks directly to your Kodi.

## 📦 Install

<div align="center">

[![Available in the Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-brightgreen?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)
[![Get the Add-On for Firefox](https://img.shields.io/badge/Firefox%20Add--ons-Install-orange?style=for-the-badge&logo=firefox&logoColor=white)](https://addons.mozilla.org/firefox/addon/sendtokodi/)
[![Get the Add-On for Edge](https://img.shields.io/badge/Edge%20Add--ons-Install-blue?style=for-the-badge&logo=microsoftedge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/sendtokodi/cfaaejdnkempodfadjkjfblimmakeaij)

</div>

It also works in other Chromium-based browsers such as Brave, Vivaldi and Opera via the Chrome Web Store.

## 🚀 Setup in 3 steps

### 1. Install the SendToKodi add-on in Kodi

The browser extension only tells Kodi *what* to play. The **[SendToKodi Kodi add-on](https://github.com/firsttris/plugin.video.sendtokodi)** does the actual work: it uses [yt-dlp](https://github.com/yt-dlp/yt-dlp) to resolve the website into a playable stream. Follow the installation guide in its repository.

### 2. Allow remote control in Kodi

1. In Kodi, open **Settings → Services → Control**.
2. Turn on **Allow remote control via HTTP**.
3. Note the **port** (default `8080`) and set a **username** and **password**.

You can find the IP address of your Kodi device under **Settings → System information → Network**.

### 3. Connect the extension

1. Click the SendToKodi icon in the browser toolbar and then the ⚙️ gear icon.
2. Enter the IP address, port, username and password from step 2.
3. Click **Test Connection**. When the browser asks for access to your Kodi, click **Allow**.

When you see *Connection successful* and the status badge says **Online**, you're done. For more room, use the full settings page via the ↗ icon in the popup (or *Extension options* in your browser).

<p align="center">
  <img src="./store-assets/screenshots/options.png" alt="The settings page with the connection list, the connection form, the Kodi setup steps and the shortcuts" width="100%" />
</p>

## 🎬 Usage

| What you want | How to do it |
| --- | --- |
| Play the current tab | Click the SendToKodi icon → **Play**, or press `Alt+Shift+K` |
| Add the current tab to the queue | Click the icon → **Add to Queue**, or press `Alt+Shift+Q` |
| Play a link without opening it | Right-click the link → **Play on Kodi** |
| Queue a link | Right-click the link → **Add to Kodi queue** |
| Play any URL | Paste it into the popup's URL field and press `Enter` |
| Stop playback | Click the icon → **Stop** |
| Switch Kodi devices | Pick another connection in the popup's dropdown |

When you use the context menu or a shortcut, the toolbar icon briefly shows **✓** if it worked or **!** if it didn't. Hover over the icon to read the message.

**Changing the shortcuts:** open `chrome://extensions/shortcuts` (Chrome, Brave, …), `edge://extensions/shortcuts` (Edge) or, in Firefox, `about:addons` → ⚙️ → *Manage Extension Shortcuts*.

## 🔧 Troubleshooting

<details>
<summary><b>"Connection failed – Kodi not reachable" or "Kodi did not respond in time"</b></summary>

- Is Kodi running, and is your computer on the same network?
- Check the IP address and port. The IP can change after a router restart, so give your Kodi device a fixed IP in your router if you can.
- Is **Allow remote control via HTTP** turned on in Kodi (see [step 2](#2-allow-remote-control-in-kodi))?
- Only turn on **Use HTTPS** if Kodi runs behind a reverse proxy with a certificate. Kodi itself only speaks HTTP.
- A firewall on the Kodi device may block the port.
</details>

<details>
<summary><b>"Wrong username or password"</b></summary>

Use exactly the username and password from Kodi's **Settings → Services → Control**. Both are case-sensitive.
</details>

<details>
<summary><b>"Access to Kodi was not granted"</b></summary>

The extension asks once for permission to talk to your Kodi's address. If you dismissed that prompt, open the popup and click **Test Connection** (or **Play**) again and choose **Allow**.

The context menu and the keyboard shortcuts can't show this prompt. Test the connection once from the popup or the settings page first.
</details>

<details>
<summary><b>"Kodi error: … – is the SendToKodi addon installed?"</b></summary>

Kodi received the request but couldn't run it. Usually the [SendToKodi Kodi add-on](https://github.com/firsttris/plugin.video.sendtokodi) is missing or outdated. Install or update it.
</details>

<details>
<summary><b>Kodi starts, but the video doesn't play</b></summary>

The video is resolved inside Kodi by the SendToKodi add-on via yt-dlp. Websites change often, so update the Kodi add-on first. If it still doesn't play, please report it in the [Kodi add-on's issues](https://github.com/firsttris/plugin.video.sendtokodi/issues) together with the URL.
</details>

<details>
<summary><b>The status badge says "Unknown"</b></summary>

The status is only checked after you've granted access to that Kodi once. Click **Test Connection**.
</details>

Still stuck? [Open an issue](https://github.com/firsttris/chrome.sendtokodi/issues) and include your browser, Kodi version and the error message.

## 🔐 Privacy & permissions

SendToKodi collects **no data**. There is no tracking and no analytics, and no server sits between your browser and Kodi. Your connections (including the Kodi password) are stored in your browser's extension storage and synced with your browser account if you have sync turned on.

| Permission | Why |
| --- | --- |
| Access to your Kodi's address (e.g. `http://192.168.1.100`) | To send commands to Kodi. Requested only when you first test a connection or play something. |
| Active tab | To read the URL of the current tab, only when you click the icon or use a shortcut. |
| Context menus | For *Play on Kodi* and *Add to Kodi queue*. |
| Storage | To save your Kodi connections. |

The extension does **not** need access to the websites you visit. All code is open source and can be reviewed in this repository.

Full details: [Privacy Policy](./PRIVACY.md)

## 🤝 Contributing

Bug reports, ideas and pull requests are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to build and run the extension locally and how releases work.

**Thanks to our contributors:**

- [@eeshugerman](https://github.com/eeshugerman): Mozilla support ([#3](https://github.com/firsttris/chrome.sendtokodi/pull/3))
- [@mauman](https://github.com/mauman): Firefox manifest fixes ([#14](https://github.com/firsttris/chrome.sendtokodi/pull/14))

## 📄 License

[MIT](./LICENSE.md)

---

<div align="center">

⭐ Like SendToKodi? [Star it on GitHub](https://github.com/firsttris/chrome.sendtokodi) • 🐛 [Report a bug](https://github.com/firsttris/chrome.sendtokodi/issues) • 💡 [Request a feature](https://github.com/firsttris/chrome.sendtokodi/issues)

</div>
