import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import { createUserCore, createUser, selectUser, updateUser, deleteUser } from "./userControllers/userController.js";
import stage from "./objectModel/stage.js";
import express from 'express';
import User from './userModel/user.js';
import { createStage } from "./objectControllers/stageController.js";

// Import all models to ensure associations are registered
import Student from './userModel/student.js';
import Stagementor from './userModel/stagementor.js';
import Stagecommisie from './userModel/stagecommisie.js';
import Admin from './userModel/admin.js';
import Docent from './userModel/docent.js';

await run();

// Create the router
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// CORS middleware
router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Create the app
const app = express();
app.use(router);

// Seed database

await seedDatabase();

// Routes
router.post("/create-user", createUser);
router.get("/select-user", selectUser);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

router.post("/create-stage", createStage);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});
