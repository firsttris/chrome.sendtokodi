import { crx, type ManifestV3Export } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import manifest from './manifest.json' with { type: 'json' };
import pkg from './package.json' with { type: 'json' };

export default defineConfig(({ mode }) => {
  const isFirefox = process.env.TARGET_PLATFORM === 'firefox';

  const finalManifest = {
    ...manifest,
    version: pkg.version,
    ...(isFirefox && {
      // Firefox runs MV3 background code as event pages instead of service workers.
      background: { scripts: [manifest.background.service_worker], type: 'module' },
      browser_specific_settings: {
        gecko_android: { strict_min_version: '142.0' },
        gecko: {
          id: 'sendtokodi@firsttris.github.io',
          strict_min_version: '140.0',
          data_collection_permissions: { required: ['none'] },
        },
      },
    }),
  } as ManifestV3Export;

  return {
    plugins: [
      solidPlugin(),
      tailwindcss(),
      crx({ manifest: finalManifest, browser: isFirefox ? 'firefox' : 'chrome' }),
    ],
    build: {
      sourcemap: mode === 'development',
    },
    server: {
      port: 3000,
      strictPort: true,
      hmr: {
        port: 3000,
      },
    },
  };
});
