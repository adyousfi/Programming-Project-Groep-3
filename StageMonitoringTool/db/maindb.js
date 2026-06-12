import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import stage from "./objectModel/stage.js";
import express from 'express';
import User from '../db/userModel/user.js';
import stageController from "./objectControllers/stageController.js";
import bedrijfController from "./objectControllers/bedrijfController.js";
import Bedrijf from "./objectModel/bedrijf.js";
import logboekController from "./objectControllers/logboekController.js";
import opmerkingLogboekController from "./objectControllers/opmerkingLogboekController.js";
import { confirmRelations } from "./allimport.js";
import { runRelationTest } from "./testrelation.js";
import behaaldeScoreController from "./objectControllers/behaaldeScoreController.js";
import competentieController from "./objectControllers/competentieController.js";
import rubriekController from "./objectControllers/rubriekController.js";
import userController from "./userControllers/userController.js";
import docentController from "./userControllers/docentController.js";


await run();
console.log(confirmRelations)
// Create the router instance using lowercase 'router'
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

// await seedDatabase();

//test of de relatie klopt
runRelationTest();

//Users
router.post("/create-user",userController.createUser)
router.get("/select-user",userController.selectUser)
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);

//Stages
router.post("/create-stage",stageController.createStage)
router.post("/update-stage",stageController.updateStage)
router.get("/select-stage",stageController.selectStage)

//Bedrijven
router.post("/assign-bedrijftomentor",bedrijfController.linkBedrijfToStageMentor)
router.post("/create-bedrijf",bedrijfController.createBedrijf)

//Logboeken
router.post("/create-logboek",logboekController.createLogboek)
router.post("/assignopmerking-logboek",logboekController.assignOpmerkingToLogboek)

//Opmerking Logboeken
router.post("/create-opmerkinglogboek",opmerkingLogboekController.createOpmerkinglogboek)

//Behaaldescores
router.post("/createbehaaldescore",behaaldeScoreController.createBehaaldescore)

//Competenties
router.post("/create-competentie",competentieController.createCompetentie)

//Rubriek
router.post("/create-rubriek",rubriekController.createRubriek)

//Docenten
router.get("/select-docent", docentController.selectDocent)


const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});
