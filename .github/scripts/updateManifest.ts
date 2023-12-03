import fs from 'fs';
import path from 'path';

const manifestPath = path.resolve(__dirname, './../../dist/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
manifest['browser_specific_settings'] = { 'gecko': { 'id': 'sendtokodi@firsttris.github.io' } };
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));