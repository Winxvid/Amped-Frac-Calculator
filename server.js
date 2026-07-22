import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets (images, html, etc.) from the project root first.
// Without this ordering — or if static files are missing — image requests
// would fall through and return index.html, which browsers show as broken images.
app.use(express.static(__dirname, {
  fallthrough: true,
  index: false,
  extensions: ['html'],
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// SPA-style fallback: only for non-file routes (no extension).
// Never rewrite requests that look like asset files.
app.get('*', (req, res, next) => {
  if (path.extname(req.path)) {
    return res.status(404).send('Not found');
  }
  const indexPath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return next(new Error('index.html missing'));
  }
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AmpdFrac server running on http://0.0.0.0:${PORT}`);
});
