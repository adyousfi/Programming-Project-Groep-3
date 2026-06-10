import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROPOSALS_PATH = path.join(__dirname, '..', 'src', 'data', 'stagevoorstellen.json');

function readProposals() {
  try {
    const raw = fs.readFileSync(PROPOSALS_PATH, 'utf-8');
    return JSON.parse(raw).proposals || [];
  } catch {
    return [];
  }
}

function writeProposals(proposals) {
  fs.writeFileSync(PROPOSALS_PATH, JSON.stringify({ proposals }, null, 2));
}


const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS met cookies
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5500'
    ];

    // allow requests without Origin (e.g. curl / same-origin)
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ start DB
await run();

// ✅ LOGIN + COOKIE
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.json({ success: false, message: 'Foute login' });
    }

    // 🔥 COOKIE zetten
    res.cookie('user', {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      role: user.role
    }, {
      httpOnly: true,          // 🔒 veiliger
      maxAge: 1000 * 60 * 60,  // 1 uur
      sameSite: 'lax'
    });

    // ✅ stuur rol mee zodat main.js meteen de juiste pagina toont
    res.json({
      success: true,
      message: 'Login succesvol',
      user: {
        first_name: user.first_name,
        role: user.role
  
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ✅ CHECK login via cookie
app.get('/me', (req, res) => {
  if (req.cookies.user) {
    res.json({ loggedIn: true, user: req.cookies.user });
  } else {
    res.json({ loggedIn: false });
  }
});
app.post('/logout', (req, res) => {
  res.clearCookie('user', {
    httpOnly: true,
    sameSite: 'lax'
  });
  res.json({ success: true });
});

// ✅ LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.json({ success: true });
});

// ✅ PROPOSALS API
app.get('/api/proposals', (req, res) => {
  res.json(readProposals());
});

app.post('/api/proposals', (req, res) => {
  const proposals = readProposals();
  const proposal = req.body;
  if (!proposal.id) {
    proposal.id = `proposal-${Date.now()}`;
  }
  proposals.push(proposal);
  writeProposals(proposals);
  res.status(201).json(proposal);
});

app.put('/api/proposals/:id', (req, res) => {
  const proposals = readProposals();
  const index = proposals.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ msg: 'Proposal niet gevonden' });
  }
  proposals[index] = { ...proposals[index], ...req.body, id: req.params.id, laatstBewerktOp: new Date().toISOString() };
  writeProposals(proposals);
  res.json(proposals[index]);
});

app.delete('/api/proposals/:id', (req, res) => {
  const proposals = readProposals();
  const filtered = proposals.filter(p => p.id !== req.params.id);
  if (filtered.length === proposals.length) {
    return res.status(404).json({ msg: 'Proposal niet gevonden' });
  }
  writeProposals(filtered);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('✅ Server running on 3000');
});