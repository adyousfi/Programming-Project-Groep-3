import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import {createUser} from "./userControllers/userController.js";
import stage from "./objectModel/stage.js";
import userController from "./userControllers/userController.js";
import express from 'express';
import User from '../db/userModel/user.js';
import stageController from "./objectControllers/stageController.js";

await run();

initAssociation();
//needs to be runned first because it drops all tables to not make any duplicates
await seedDatabase();

router.post("/create-user", userController.createUser)
router.get("/select-user", userController.selectUser)

router.post("/create-stage",stageController.createStage)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});