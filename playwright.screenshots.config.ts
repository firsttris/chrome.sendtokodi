import { defineConfig } from '@playwright/test';

// The pictures of the README, the documentation and the store listings: bun run screenshots
export default defineConfig({
  testDir: './screenshots',
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4319',
    locale: 'en-US',
    colorScheme: 'dark',
    deviceScaleFactor: 2,
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  },
  webServer: {
    // The built popup and options page, served as plain pages
    command: 'bun run build && bun --bun vite preview --host 127.0.0.1 --port 4319 --strictPort',
    url: 'http://127.0.0.1:4319/popup.html',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
