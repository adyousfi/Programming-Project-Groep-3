import "./userModel/user.js"
import User from "./userModel/user.js";
import Student from "./userModel/users/student.js";
import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import createUser from "./controllers/userController.js";
import createStudent from "./controllers/userStudent.js";

await run();
//needs to be runned first because it drops all tables to not make any duplicates
await seedDatabase();


await createStudent("ariga","toe","arigatoe@html.com","IlikeToes");
await createUser("jon","hys","hys.jon@html.com","passwrd");


await sequelize.close();