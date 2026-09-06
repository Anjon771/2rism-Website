import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static assets with case support
app.use('/Imgs', express.static(path.join(__dirname, 'Imgs')));
app.use('/imgs', express.static(path.join(__dirname, 'Imgs')));
app.use('/JS', express.static(path.join(__dirname, 'JS')));
app.use('/js', express.static(path.join(__dirname, 'JS')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// Root static files
app.use(express.static(__dirname, {
  index: ['index.html']
}));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
