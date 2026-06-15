import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { run } from '../db/dbConnection.js';
import '../db/allimport.js'; // Ensure relations are loaded

// Import Routers
import userRoutes from '../db/routes/userRoutes.js';
import stageRoutes from '../db/routes/stageRoutes.js';
import documentRoutes from '../db/routes/documentRoutes.js';
import docentRoutes from '../db/routes/docentRoutes.js';

const app = express();

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

// Mount Routers
app.use('/', userRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/docenten', docentRoutes);

async function start() {
  await run();
  app.listen(3000, () => {
    console.log('✅ Server running on 3000');
  });
}

start();