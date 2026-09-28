import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts so the crx plugin does not run during tests.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
