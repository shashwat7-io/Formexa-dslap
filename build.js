import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📦 Starting FORMEXA - dslap Render build...');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy standalone.html into dist as both index.html and standalone.html
const standaloneSource = path.join(__dirname, 'standalone.html');
const standaloneDest = path.join(distDir, 'standalone.html');
const indexDest = path.join(distDir, 'index.html');

if (fs.existsSync(standaloneSource)) {
  fs.copyFileSync(standaloneSource, standaloneDest);
  fs.copyFileSync(standaloneSource, indexDest);
  console.log('✅ Successfully copied standalone bundle to dist/index.html & dist/standalone.html!');
}

console.log('🎉 Render build complete successfully!');
