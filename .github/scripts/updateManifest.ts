import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync(new URL('./dist/manifest.json', import.meta.url), 'utf-8'));
manifest['browser_specific_settings'] = { 'gecko': { 'id': 'sendtokodi@firsttris.github.io' } };
fs.writeFileSync(new URL('./dist/manifest.json', import.meta.url), JSON.stringify(manifest, null, 2));