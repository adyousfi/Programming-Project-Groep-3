import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
// The client-side stagecommissie renderer lives under src; serve index.html instead of server-side rendering

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const DATA_FILE = join(__dirname, 'src', 'data', 'stagevoorstellen.json');

app.use(express.json());
// Serve project root (index.html + /src) so the SPA can load client modules
app.use(express.static(join(__dirname)));
app.use('/stagecommissie', express.static(join(__dirname, 'src', 'stagecommissie')));

async function readProposalsFile() {
  try {
    const fileContents = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return { proposals: [] };
  }
}

async function writeProposalsFile(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/proposals', async (req, res) => {
  const data = await readProposalsFile();
  res.json(data.proposals || []);
});

app.post('/api/proposals', async (req, res) => {
  const proposal = req.body;
  if (!proposal || typeof proposal !== 'object') {
    return res.status(400).json({ error: 'Ongeldig voorstel ontvangen.' });
  }

  const data = await readProposalsFile();
  data.proposals = Array.isArray(data.proposals) ? data.proposals : [];
  data.proposals.push(proposal);

  await writeProposalsFile(data);
  res.status(201).json(proposal);
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
