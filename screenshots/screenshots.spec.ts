import { join } from 'node:path';
import { expect, type Page, test } from '@playwright/test';
import { chromeStub } from './chrome-stub';

/**
 * The popup and the options page as the README, the documentation and the store listings show
 * them: two Kodi connections, the living room one online, a YouTube video in the active tab.
 * The pages run as plain pages with a stand-in for the extension API (chrome-stub.ts); Kodi's
 * JSON-RPC answers through page.route. Each picture goes to docs/ and store-assets/screenshots/.
 */

const ROOT = join(import.meta.dirname, '..');
const VIDEO = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';

const save = async (page: Page, name: string) => {
  for (const dir of ['docs', 'store-assets/screenshots']) {
    await page.screenshot({ path: join(ROOT, dir, `${name}.png`), animations: 'disabled', caret: 'hide' });
  }
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(chromeStub(VIDEO));
  // The living room Kodi answers, the bedroom one is switched off
  await page.route('http://192.168.1.100:8080/jsonrpc', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify({ jsonrpc: '2.0', id: 1, result: 'pong' }) })
  );
  await page.route('http://192.168.1.101:8080/jsonrpc', (route) => route.abort('connectionrefused'));
});

test('popup', async ({ page }) => {
  await page.setViewportSize({ width: 340, height: 470 });
  await page.goto('/popup.html');
  await expect(page.getByText('Online')).toBeVisible();
  await expect(page.getByRole('textbox')).toHaveValue(VIDEO);
  // No focus ring on the URL field
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await save(page, 'popup');
});

test('popup settings', async ({ page }) => {
  await page.setViewportSize({ width: 340, height: 548 });
  await page.goto('/popup.html');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
  await expect(page.getByText('Online')).toBeVisible();
  await save(page, 'popup-settings');
});

test('options', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1154 });
  await page.goto('/options.html');
  await expect(page.getByText('Online')).toBeVisible();
  await save(page, 'options');
});
