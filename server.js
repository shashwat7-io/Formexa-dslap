import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

const distDir = path.join(__dirname, 'dist');
const standalonePath = path.join(__dirname, 'standalone.html');

// Serve static assets from dist if available, else root
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}
app.use(express.static(__dirname));

// Route handling
app.get('/standalone', (req, res) => {
  res.sendFile(standalonePath);
});

app.get('*', (req, res) => {
  if (fs.existsSync(path.join(distDir, 'index.html'))) {
    res.sendFile(path.join(distDir, 'index.html'));
  } else if (fs.existsSync(standalonePath)) {
    res.sendFile(standalonePath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FORMEXA - dslap server running on Render port ${PORT}`);
});
