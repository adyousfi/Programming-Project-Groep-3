import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import stage from "./objectModel/stage.js";
import userController from "./userControllers/userController.js";
import express from 'express';
import User from '../db/userModel/user.js';
import stageController from "./objectControllers/stageController.js";
import bedrijfController from "./objectControllers/bedrijfController.js";
import Bedrijf from "./objectModel/bedrijf.js";
import logboekController from "./objectControllers/logboekController.js";
import opmerkingLogboekController from "./objectControllers/opmerkingLogboekController.js";
import { confirmRelations } from "./allimport.js";
import { runRelationTest } from "./testrelation.js";
await run();
console.log(confirmRelations)
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

//test of de relatie klopt
runRelationTest();

//Users
router.post("/create-user", userController.createUser)
router.get("/select-user", userController.selectUser)

//Stages
router.post("/create-stage",stageController.createStage)
router.post("/update-stage",stageController.updateStage)

//Bedrijven
router.post("/assign-bedrijftomentor",bedrijfController.linkBedrijfToStageMentor)
router.post("/create-bedrijf",bedrijfController.createBedrijf)

//Logboeken
router.post("/create-logboek",logboekController.createLogboek)
router.post("/assignopmerking-logboek",logboekController.assignOpmerkingToLogboek)

//Opmerking Logboeken
router.post("/create-opmerkinglogboek",opmerkingLogboekController.createOpmerkinglogboek)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});