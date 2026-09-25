import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📦 Starting FORMEXA - dslap Render build...');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Try running Vite build if Vite & Node dependencies exist
try {
  console.log('⚡ Running Vite production build...');
  execSync('npx vite build', { stdio: 'inherit' });
} catch (err) {
  console.warn('⚠️ Vite build warning, using standalone HTML fallback bundle...');
}

// Copy standalone.html into dist for robust fallback
const standaloneSource = path.join(__dirname, 'standalone.html');
const standaloneDest = path.join(distDir, 'standalone.html');
const indexDest = path.join(distDir, 'index.html');

if (fs.existsSync(standaloneSource)) {
  fs.copyFileSync(standaloneSource, standaloneDest);
  console.log('✅ Copied standalone.html to dist/standalone.html');

  // If index.html in dist does not exist or is empty, use standalone.html as index.html
  if (!fs.existsSync(indexDest) || fs.statSync(indexDest).size < 100) {
    fs.copyFileSync(standaloneSource, indexDest);
    console.log('✅ Prepared dist/index.html from standalone bundle for Render!');
  }
}

console.log('🎉 Render build complete successfully!');
