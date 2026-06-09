import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import {createUser} from "./userControllers/userController.js";
import stage from "./objectModel/stage.js";
import { initAssociation } from "../../association.js";

await run();

initAssociation();
//needs to be runned first because it drops all tables to not make any duplicates
await seedDatabase();

await sequelize.close();