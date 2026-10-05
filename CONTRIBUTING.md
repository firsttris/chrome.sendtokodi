# Contributing to SendToKodi

Thanks for helping! Bug reports and feature ideas go to the [issues](https://github.com/firsttris/chrome.sendtokodi/issues), and code changes as a pull request against `master`.

If a website doesn't play on Kodi, the cause is usually in the [Kodi add-on](https://github.com/firsttris/plugin.video.sendtokodi) (yt-dlp), not in this browser extension.

## 🛠️ Tech stack

TypeScript · [Solid.js](https://www.solidjs.com/) · [Vite](https://vite.dev/) with [CRXJS](https://crxjs.dev/) · [Tailwind CSS v4](https://tailwindcss.com/) · [Biome](https://biomejs.dev/) · [Vitest](https://vitest.dev/)

The UI follows the [shadcn/ui](https://ui.shadcn.com/) look: the design tokens live in `src/index.css`, the primitives (Button, Input, Switch, Alert, …) in `src/components/ui.tsx`, and the icons are from [Lucide](https://lucide.dev/).

## 💻 Development

### Prerequisites

- Node.js 22.12 or higher (see `.nvmrc`)
- npm

### Setup

```bash
git clone https://github.com/firsttris/chrome.sendtokodi.git
cd chrome.sendtokodi
npm install

# Development build with hot reload
npm run start
npm run start:firefox   # Firefox variant

# Production builds into dist/
npm run build
npm run build:firefox
```

### Load the extension

**Chrome:**
1. Open `chrome://extensions/`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and pick the `dist` folder

**Firefox:**
1. Open `about:debugging`
2. Click **This Firefox** → **Load Temporary Add-on…**
3. Pick `dist/manifest.json`

During `npm run start` the extension reloads automatically when you change code.

### Before you open a pull request

```bash
npm run check       # lint & format (Biome)
npm run typecheck
npm test
```

CI runs the same checks and both builds on every pull request.

### Project structure

| Path | Contents |
| --- | --- |
| `src/popup.tsx`, `src/options.tsx` | Entry points of the popup and the settings page |
| `src/background.ts` | Context menu and keyboard shortcuts |
| `src/components/` | UI components |
| `src/provider/` | State: saved connections (`StoreProvider`) and Kodi actions (`ApiProvider`) |
| `src/lib/` | Kodi JSON-RPC client and connection helpers, with tests |
| `public/_locales/` | Translations (`en`, `de`) |
| `store-assets/` | Banners, screenshots and the store description |

### Translations

Texts live in `public/_locales/<language>/messages.json`. Add new keys to **every** language. To add a language, copy `en/messages.json` into a new folder named after the [locale code](https://developer.chrome.com/docs/extensions/reference/api/i18n#locales) and translate the `message` values.

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
