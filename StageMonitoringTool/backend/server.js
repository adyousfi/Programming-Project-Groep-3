import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { run } from '../db/dbConnection.js';
import '../db/allimport.js';
import seedDatabase from '../db/seedDb.js';

import userRoutes from '../db/routes/userRoutes.js';
import stageRoutes from '../db/routes/stageRoutes.js';
import documentRoutes from '../db/routes/documentRoutes.js';
import docentRoutes from '../db/routes/docentRoutes.js';
import bedrijfRoutes from '../db/routes/bedrijfRoutes.js';
import logboekRoutes from '../db/routes/logboekRoutes.js';
import opmerkingLogboekRoutes from '../db/routes/opmerkingLogboekRoutes.js';
import behaaldeScoreRoutes from '../db/routes/behaaldeScoreRoutes.js';
import competentieRoutes from '../db/routes/competentieRoutes.js';
import rubriekRoutes from '../db/routes/rubriekRoutes.js';
import evaluatieRoutes from '../db/routes/evaluatieRoutes.js';

const app = express();

// await seedDatabase();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5500'
    ];
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
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
app.use('/api/opmerkingen-logboek', opmerkingLogboekRoutes);
app.use('/api/behaalde-scores', behaaldeScoreRoutes);
app.use('/api/competenties', competentieRoutes);
app.use('/api/rubrieken', rubriekRoutes);
app.use('/api/evaluaties', evaluatieRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ msg: err.message });
  }
  if (err.message && err.message.includes('Bestandstype')) {
    return res.status(400).json({ msg: err.message });
  }
  next(err);
});

async function start() {
  await run();
  app.listen(3000, () => {
    console.log('✅ Server running on 3000');
  });
}

start();
