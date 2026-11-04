# Contributing to SendToKodi

Thanks for helping! Bug reports and feature ideas go to the [issues](https://github.com/firsttris/chrome.sendtokodi/issues), and code changes as a pull request against `master`.

If a website doesn't play on Kodi, the cause is usually in the [Kodi add-on](https://github.com/firsttris/plugin.video.sendtokodi) (yt-dlp), not in this browser extension.

## 🛠️ Tech stack

TypeScript · [Solid.js](https://www.solidjs.com/) · [Vite](https://vite.dev/) with [CRXJS](https://crxjs.dev/) · [Tailwind CSS v4](https://tailwindcss.com/) · [Biome](https://biomejs.dev/) · [Vitest](https://vitest.dev/)

## 💻 Development

[Bun](https://bun.sh/) (the version in `packageManager` in `package.json`).

```bash
git clone https://github.com/firsttris/chrome.sendtokodi.git
cd chrome.sendtokodi
bun install

bun run start           # development build with hot reload
bun run start:firefox   # Firefox variant
bun run build           # production builds into dist/
bun run build:firefox
```

Load the `dist` folder as an unpacked extension (`chrome://extensions/` → *Developer mode* → *Load unpacked*; Firefox: `about:debugging` → *This Firefox* → *Load Temporary Add-on…* → `dist/manifest.json`).

### Before you open a pull request

```bash
bun run check       # lint & format (Biome)
bun run typecheck
bun run test
```

CI runs the same checks and both builds on every pull request.

The project structure, translations, conventions and how to work on the documentation are in the
[development guide](https://firsttris.github.io/chrome.sendtokodi/development.html) ([source](docs/development.md)).

## 📤 Publishing

A release is a tag `vX.Y.Z`: *Actions → Bump version → Run workflow* (or `bun run release:patch|minor|major`) raises the version, tags it and starts the release, which builds both packages, creates the GitHub release and uploads to the Chrome Web Store, Mozilla Add-ons and Microsoft Edge Add-ons. Details and the required secrets: [Releases](https://firsttris.github.io/chrome.sendtokodi/releases.html) ([source](docs/releases.md)).
