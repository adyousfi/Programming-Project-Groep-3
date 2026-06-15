import express from 'express';
import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import { confirmRelations } from "./allimport.js";
import { runRelationTest } from "./testrelation.js";

// Import Routers
import userRoutes from './routes/userRoutes.js';
import stageRoutes from './routes/stageRoutes.js';
import bedrijfRoutes from './routes/bedrijfRoutes.js';
import logboekRoutes from './routes/logboekRoutes.js';
import opmerkingLogboekRoutes from './routes/opmerkingLogboekRoutes.js';
import behaaldeScoreRoutes from './routes/behaaldeScoreRoutes.js';
import competentieRoutes from './routes/competentieRoutes.js';
import rubriekRoutes from './routes/rubriekRoutes.js';
import docentRoutes from './routes/docentRoutes.js';

await run();
console.log(confirmRelations)

// Create the app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Seed database
// await seedDatabase();

//test of de relatie klopt
runRelationTest();

// Mount Routers directly on app
app.use(userRoutes);
app.use(stageRoutes);
app.use(bedrijfRoutes);
app.use(logboekRoutes);
app.use(opmerkingLogboekRoutes);
app.use(behaaldeScoreRoutes);
app.use(competentieRoutes);
app.use(rubriekRoutes);
app.use(docentRoutes);

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});
