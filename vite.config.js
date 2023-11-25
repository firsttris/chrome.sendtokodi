// vite.config.js
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { copy, readJson, writeJson } from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Copy static files to the build directory
const copyAssets = {
  name: 'copy-assets',
  apply: 'build',
  async buildStart() {
    const manifestPath = path.resolve(__dirname, 'public/manifest.json')
    const manifest = await readJson(manifestPath)
    manifest.version = process.env.npm_package_version

    if (process.env.TARGET_PLATFORM === 'firefox') {
      manifest.browser_specific_settings = {
        gecko: {
          id: "sendtokodi@firsttris.github.io",
        }
      }
    }

    await writeJson(manifestPath, manifest, { spaces: 2 })

    await copy(path.resolve(__dirname, 'src/assets'), path.resolve(__dirname, 'dist/assets'))
    await copy(path.resolve(__dirname, 'src/popup.html'), path.resolve(__dirname, 'dist/popup.html'))
    await copy(path.resolve(__dirname, 'src/options.html'), path.resolve(__dirname, 'dist/options.html'))
    await copy(path.resolve(__dirname, 'src/background.html'), path.resolve(__dirname, 'dist/background.html'))
  }
}

export default defineConfig({
  plugins: [solidPlugin(), copyAssets],
  resolve: {
    alias: {
      '.js': '.ts',
      '.cjs': '.cts',
      '.mjs': '.mts'
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'build'),
    assetsDir: '',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.tsx'),
        background: path.resolve(__dirname, 'src/background.ts'),
        options: path.resolve(__dirname, 'src/options.tsx'),
        popup: path.resolve(__dirname, 'src/popup.tsx'),
      },
    }
  }
})