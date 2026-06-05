import "./userModel/users/user.js"
import User, { ROLES } from "./userModel/users/user.js";
import Student from "./userModel/users/student.js";
import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import createUser from "./controllers/userController.js";

await run();
//needs to be runned first because it drops all tables to not make any duplicates
await seedDatabase();


await sequelize.close();