import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Buku Induk Siswa SMP',
    timestamp: new Date().toISOString(),
  });
});

// Serve static assets from Vite build directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback: any route not matching a file returns index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server Buku Induk Siswa running on port ${PORT}`);
  console.log(`Ready for production hosting!`);
});
