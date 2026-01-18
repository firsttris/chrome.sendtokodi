import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import manifest from './manifest.json' with { type: 'json' };

export default defineConfig(({ mode }) => {
  const isFirefox = process.env.TARGET_PLATFORM === 'firefox';
  
  // Manifest anpassen für Firefox
  const finalManifest = {
    ...manifest,
    version: process.env.npm_package_version || manifest.version,
    ...(isFirefox && {
      browser_specific_settings: {
        gecko: {
          id: "sendtokodi@firsttris.github.io",
        }
      },
      host_permissions: [...(manifest.host_permissions || []), "<all_urls>"]
    })
  };

  return {
    plugins: [
      solidPlugin(),
      tailwindcss(),
      crx({ manifest: finalManifest as any }),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
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
