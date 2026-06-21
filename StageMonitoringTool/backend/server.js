import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { run } from '../db/dbConnection.js';
import '../db/allimport.js';
import authMiddleware from './auth/authMiddleware.js';

import userRoutes from '../db/routes/userRoutes.js';
import stageRoutes from '../db/routes/stageRoutes.js';
import documentRoutes from '../db/routes/documentRoutes.js';
import docentRoutes from '../db/routes/docentRoutes.js';
import bedrijfRoutes from '../db/routes/bedrijfRoutes.js';
import logboekRoutes from '../db/routes/logboekRoutes.js';
import competentieRoutes from '../db/routes/competentieRoutes.js';
import rubriekRoutes from '../db/routes/rubriekRoutes.js';
import evaluatieRoutes from '../db/routes/evaluatieRoutes.js';

const app = express();

dotenv.config();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/api', authMiddleware);

app.use(cors({
  origin: (origin, cb) => {
    // For a public server, you should ideally add your public domain to the allowed list, 
    // or allow all origins dynamically. Here we allow all origins for public access.
    return cb(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/', userRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/docenten', docentRoutes);
app.use('/api/bedrijven', bedrijfRoutes);
app.use('/api/logboek', logboekRoutes);
app.use('/api/competenties', competentieRoutes);
app.use('/api/rubrieken', rubriekRoutes);
app.use('/api/evaluaties', evaluatieRoutes);
console.log('✅ eval routes mounted');

// Serve Vite frontend in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ msg: err.message });
  }
  if (err.message && err.message.includes('Bestandstype')) {
    return res.status(400).json({ msg: err.message });
  }
  // Fallback for body-parser or other middleware errors
  console.error('Globale serverfout:', err);
  const status = err.status || 500;
  return res.status(status).json({ msg: err.message || 'Interne serverfout' });
});

async function start() {
  try {
    await run();
    // process.env.PORT is provided by IISNode on the Windows server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("FATAL ERROR DURING STARTUP:", error);
    process.exit(1);
  }
}

start();
