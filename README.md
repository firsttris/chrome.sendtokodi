<div align="center">

  # SendToKodi
  <img src="./store-assets/banner/1280x800.png" alt="SendToKodi Banner" width="100%" />

  [![Check Build](https://github.com/firsttris/chrome.sendtokodi/actions/workflows/check_build.yml/badge.svg)](https://github.com/firsttris/chrome.sendtokodi/actions/workflows/check_build.yml)
  [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/gbcpfpcacakaadapjcdchbdmdnfbnbaf?label=Chrome&logo=google-chrome)](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)
  [![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/gbcpfpcacakaadapjcdchbdmdnfbnbaf?label=Chrome%20Users)](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)
  [![Mozilla Add-on](https://img.shields.io/amo/v/sendtokodi?label=Firefox&logo=firefox)](https://addons.mozilla.org/firefox/addon/sendtokodi/)
  [![Mozilla Add-on Users](https://img.shields.io/amo/users/sendtokodi?label=Firefox%20Users)](https://addons.mozilla.org/firefox/addon/sendtokodi/)

  Stream almost any video from your browser directly to Kodi - Simple, powerful, and open source.
</div>

## ✨ Features

- 🎬 **Universal Streaming** - Support for [1000+ websites](https://github.com/yt-dlp/yt-dlp#supported-sites) via yt-dlp
- 📋 **Playlist Support** - Send entire playlists with a single click
- 🔄 **Multiple Connections** - Save and manage different Kodi instances
- 🚀 **One-Click Send** - Stream instantly from your browser
- 🖱️ **Context Menu** - Right-click any link, video or page and choose *Play on Kodi* or *Add to Kodi queue*
- ⌨️ **Keyboard Shortcuts** - `Alt+Shift+K` plays the current tab, `Alt+Shift+Q` adds it to the queue (customizable in the browser's shortcut settings)
- 🟢 **Connection Status** - See at a glance whether your Kodi is reachable
- 🔒 **Privacy-Focused** - No data collection, fully open source
- 🎨 **Modern UI** - Built with modern web technologies

## 📦 Installation
<div align="center">

### Chrome Web Store
[![Available in the Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Available-brightgreen?style=for-the-badge&logo=googlechrome)](https://chrome.google.com/webstore/detail/sendtokodi/gbcpfpcacakaadapjcdchbdmdnfbnbaf)

### Mozilla Add-ons
[![Get the Add-On](https://img.shields.io/badge/Firefox%20Add--ons-Available-orange?style=for-the-badge&logo=firefox)](https://addons.mozilla.org/firefox/addon/sendtokodi/)

### Microsoft Edge Add-ons
[![Get the Add-On](https://img.shields.io/badge/Edge%20Add--ons-Available-blue?style=for-the-badge&logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/sendtokodi/cfaaejdnkempodfadjkjfblimmakeaij)
</div>

## 📋 Requirements

To use this extension, you need to install the SendToKodi Addon in Kodi:

**Kodi Addon:** [plugin.video.sendtokodi](https://github.com/firsttris/plugin.video.sendtokodi)

The addon handles the actual streaming on the Kodi side and must be installed for this extension to work.

## 🔐 Permissions

The extension only asks for access to your Kodi host (e.g. `http://192.168.1.100`) the first time you play something or test a connection. It does not need access to the websites you visit: the URL of the current tab is only read when you click the extension icon, use the context menu or a keyboard shortcut.

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="150">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="150">
<img src="https://www.solidjs.com/img/logo/without-wordmark/logo.svg" width="48" height="48" alt="Solid.js" />
<br>Solid.js
</td>
<td align="center" width="150">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="48" height="48" alt="Vite" />
<br>Vite
</td>
<td align="center" width="150">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind CSS" />
<br>Tailwind CSS
</td>
</tr>
</table>

## 💻 Development

### Prerequisites

- Node.js 22.12 or higher (see `.nvmrc`)
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/firsttris/chrome.sendtokodi.git
cd chrome.sendtokodi

# Install dependencies
npm install

# Start development server
npm run start
# For Firefox compatibility
npm run start:firefox

# Lint, typecheck and test
npm run check
npm run typecheck
npm test
```

### Load Extension

**Chrome:**
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `dist` folder from the project

**Firefox:**
1. Open Firefox and navigate to `about:debugging`
2. Click **This Firefox**
3. Click **Load Temporary Add-on...**
4. Select the `manifest.json` in the `dist` folder

The extension will hot-reload as you make changes.


## 🔐 Privacy & Security

- **100% Open Source** - All code is available for review
- **No Tracking** - We don't collect any data
- **Local Processing** - Everything runs on your device
- **Transparent Permissions** - Only uses necessary browser APIs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**Special thanks to our contributors:**

- [@eeshugerman](https://github.com/eeshugerman) - Mozilla support [#3](https://github.com/firsttris/chrome.sendtokodi/pull/3)
- [@mauman](https://github.com/mauman) - Firefox manifest fixes [#14](https://github.com/firsttris/chrome.sendtokodi/pull/14)

## 📤 Publishing
<details>
<summary><b>How releases and store uploads work</b></summary>

A release is a tag `vX.Y.Z`, as in the other projects ([firsttris/workflows](https://github.com/firsttris/workflows)):

- **Actions → Bump version → Run workflow** (patch, minor or major) raises the version in `package.json`, commits it as `Release vX.Y.Z`, tags it and starts the release. On a checkout, `npm run release:patch` (or `:minor`, `:major`) does the same.
- The tag starts **Release**: lint, typecheck and tests, the Chrome and Firefox builds, then a GitHub release with generated notes and both packages, then the store uploads in parallel.
- To submit an existing version again, e.g. to one store only, run **Release** by hand on its tag and untick the other stores.

```bash
gh workflow run bump.yml -f bump=minor                          # new release, all stores
gh workflow run release.yml --ref v0.0.51 -f edge=false      # existing release, again without Edge
```

The Chrome package is uploaded as a draft (`publish: false`) and has to be submitted for review in the developer dashboard. Firefox receives the source archive of the tagged commit for the review.

### Secrets

**Chrome Web Store** (see [chrome-webstore-upload-keys](https://github.com/fregante/chrome-webstore-upload-keys)): `CHROME_EXTENSION_ID`, `CHROME_CLIENT_ID`, `CHROME_CLIENT_SECRET`, `CHROME_REFRESH_TOKEN`. The publisher ID is not secret and is set in the workflow; it is part of the developer dashboard URL (`https://chrome.google.com/webstore/devconsole/<publisher-id>`).

**Mozilla Add-ons** ([API keys](https://addons.mozilla.org/developers/addon/api/key/)): `AMO_JWT_ISSUER`, `AMO_JWT_SECRET`.

**Microsoft Edge Add-ons** ([Publish API](https://partner.microsoft.com/dashboard/microsoftedge/publishapi)): `EDGE_PRODUCT_ID`, `EDGE_CLIENT_ID`, `EDGE_API_KEY`.
</details>

---

<div align="center">

**Made by the open source community**

⭐ Star us on [GitHub](https://github.com/firsttris/chrome.sendtokodi) • 🐛 [Report a Bug](https://github.com/firsttris/chrome.sendtokodi/issues) • 💡 [Request a Feature](https://github.com/firsttris/chrome.sendtokodi/issues)

</div>
