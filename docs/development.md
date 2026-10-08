---
description: Develop the SendToKodi browser extension. Tech stack (TypeScript, Solid.js, Vite with CRXJS, Tailwind CSS, Biome, Vitest), local setup with hot reload, loading the extension in Chrome and Firefox, checks and tests, project structure, translations.
---

# Development

Bug reports and feature ideas go to the [issues](https://github.com/firsttris/chrome.sendtokodi/issues), and code
changes as a pull request against `master`. If a website doesn't play on Kodi, the cause is usually in the
[Kodi add-on](https://github.com/firsttris/plugin.video.sendtokodi) (yt-dlp), not in this extension.

## Tech stack

TypeScript · [Solid.js](https://www.solidjs.com/) · [Vite](https://vite.dev/) with [CRXJS](https://crxjs.dev/) ·
[Tailwind CSS v4](https://tailwindcss.com/) · [Biome](https://biomejs.dev/) · [Vitest](https://vitest.dev/)

The UI follows the [shadcn/ui](https://ui.shadcn.com/) look: the design tokens live in `src/index.css`, the primitives
(Button, Input, Switch, Alert, …) in `src/components/ui.tsx`, and the icons are from [Lucide](https://lucide.dev/).

## Setup

Requirements: Node.js 22.12 or newer (see `.nvmrc`) and npm.

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

## Load the extension

=== "Chrome, Edge, Brave"

    1. Open `chrome://extensions/` (`edge://extensions/` in Edge).
    2. Turn on **Developer mode** (top right).
    3. Click **Load unpacked** and pick the `dist` folder.

=== "Firefox"

    1. Open `about:debugging`.
    2. Click **This Firefox** → **Load Temporary Add-on…**.
    3. Pick `dist/manifest.json`.

During `npm run start` the extension reloads automatically when you change code. A temporary add-on in Firefox is
removed when the browser closes; load it again next time.

## Checks and tests

```bash
npm run check       # lint & format (Biome)
npm run format      # apply Biome's formatting
npm run typecheck   # tsc
npm test            # Vitest
```

CI runs the same checks, both builds and `web-ext lint` on the Firefox build for every pull request (see
[Releases](releases.md#continuous-integration)). The unit tests cover the JSON-RPC client (`src/lib/kodi.test.ts`)
and the connection handling (`src/lib/connections.test.ts`); add tests next to the code you change.

## Project structure

| Path | Contents |
|---|---|
| `manifest.json` | The extension manifest (Manifest V3). The version comes from `package.json` at build time; `vite.config.ts` adapts it for Firefox. |
| `popup.html`, `options.html` | The two HTML entry points |
| `src/popup.tsx`, `src/options.tsx`, `src/renderApp.tsx` | Mount the popup and the settings page with the providers |
| `src/background.ts` | Service worker (event page in Firefox): context menu, keyboard shortcuts, badge |
| `src/components/` | UI components: `Popup`, `Settings`, `Form`, `ConnectionManager`, `SelectOne`, `StatusMessage`, the primitives in `ui.tsx` and the icons |
| `src/provider/` | State: saved connections (`StoreProvider`) and Kodi actions (`ApiProvider`) |
| `src/lib/` | `kodi.ts` (JSON-RPC client, plugin URLs, permissions), `connections.ts` (storage, defaults, names), `types.ts`, with tests |
| `src/utils/i18n.ts` | `t()` for `chrome.i18n` and the error message mapping |
| `src/index.css` | Tailwind and the design tokens |
| `public/_locales/` | Translations (`en`, `de`) |
| `public/icons/` | Extension icons |
| `store-assets/` | Banners, screenshots and the store description |
| `docs/`, `mkdocs.yml` | This documentation |
| `.github/workflows/` | CI, version bump, release and docs workflows |

## Translations

Texts live in `public/_locales/<language>/messages.json`. Add new keys to **every** language. To add a language, copy
`en/messages.json` into a new folder named after the
[locale code](https://developer.chrome.com/docs/extensions/reference/api/i18n#locales) and translate the `message`
values. The extension name and description in the stores come from `extName` and `extDescription`.

## Conventions

- Biome formats and lints; run `npm run format` before committing. Single quotes, 120 columns, two spaces.
- No content scripts and no new permissions without a strong reason; the permission list is part of what users trust.
- Keep the Kodi protocol in `src/lib/kodi.ts` and test it. UI components should not build plugin URLs themselves.
- Error messages are keys in `messages.json` (`error_<code>`), so every new `KodiErrorCode` needs a message in every
  language.

## Writing documentation

The documentation is Markdown in `docs/`, built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/)
and published at [firsttris.github.io/chrome.sendtokodi](https://firsttris.github.io/chrome.sendtokodi/).

```bash
pip install -r requirements-docs.txt
mkdocs serve        # live preview at http://127.0.0.1:8000
mkdocs build --strict
```

`mkdocs.yml` holds the navigation; add new pages there. Every page starts with a `description` in its front matter,
which becomes the page's meta description for search engines. Links between pages are relative Markdown links
(`setup.md#several-kodi-devices`), which work on GitHub and on the site alike. Screenshots live in `docs/` next to the
pages (copies of `store-assets/screenshots/`). `--strict` fails on broken links; CI runs it on every pull request that
touches the docs. The README on GitHub stays the short overview and links here for details.
