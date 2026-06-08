import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import {createUser} from "./userControllers/userController.js";
import stage from "./objectModel/stage.js";

await run();

//needs to be runned first because it drops all tables to not make any duplicates
await seedDatabase();

await sequelize.close();