import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import {createUser} from "./controllers/userController.js";
import stage from "./stage/stage.js";

await run();

//needs to be runned first because it drops all tables to not make any duplicates
await seedDatabase();

await sequelize.close();