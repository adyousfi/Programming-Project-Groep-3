import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { renderAanvragenPage } from './stagecommissie/aanvragen.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(join(__dirname, 'public')));
app.use('/stagecommissie', express.static(join(__dirname, 'stagecommissie')));

app.get('/', (req, res) => {
  res.send(renderAanvragenPage());
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
