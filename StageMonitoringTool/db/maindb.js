import "./userModel/user.js"
import User from "./userModel/user.js";
import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";



run();
seedDatabase();


