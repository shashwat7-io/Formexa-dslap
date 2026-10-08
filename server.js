import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

const standalonePath = path.join(__dirname, 'standalone.html');
const distDir = path.join(__dirname, 'dist');

// Health check endpoint for Render
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Explicit routes for standalone app
app.get('/standalone', (req, res) => {
  res.sendFile(standalonePath);
});

app.get('/', (req, res) => {
  if (fs.existsSync(standalonePath)) {
    res.sendFile(standalonePath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Serve static assets
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  if (fs.existsSync(standalonePath)) {
    res.sendFile(standalonePath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FORMEXA - dslap server running on Render port ${PORT} (0.0.0.0)`);
});
