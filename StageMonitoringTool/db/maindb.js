import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import stage from "./objectModel/stage.js";
import userController from "./userControllers/userController.js";
import express from 'express';
import User from '../db/userModel/user.js';


await run();

// Create the router instance using lowercase 'router'
const router = express.Router();

// Middleware to parse JSON bodies (Crucial for POST requests)
router.use(express.json());


// Create a main app instance to actually run the server
const app = express();

// Use the router we just configured
app.use(router);

//needs to be runned first because it drops all tables to not make any duplicates
await seedDatabase();

router.post("/create-user", userController.createUser)
router.get("/select-user", userController.selectUser)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is successfully running on http://localhost:${PORT}`);
});