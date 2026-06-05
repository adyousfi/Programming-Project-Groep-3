// db/seed.js
import { ENUM } from "sequelize";
import {sequelize} from "./dbConnection.js";
import User, { ROLES } from "./userModel/users/user.js";
import createUser from "./controllers/userController.js";
import createStage from "./controllers/stageController.js";
import { status } from "./stage/stage.js";

const seedDatabase = async () => {
  try {
    // 1. Ensure connection is alive
    await sequelize.authenticate();
    console.log("Connected to database for seeding...");

    // 2. Clear existing data and recreate the tables fresh
    // WARNING: This drops tables. Use { alter: true } or omit if you don't want to lose current data.
    await sequelize.sync({ force: true });
    console.log("Tables reset cleanly.");

    // 3. Bulk insert the dummy data
    
    await createUser("jon","hys","hys.jon@html.com","passwrd",ROLES.STUDENT,"0493998987");
    await createUser("John","Doe","john.doe@school.com","hashed_password_123",ROLES.DOCENT);
    await createUser("huh","hah","helnah@hotmail.com","hashpassword", ROLES.ADMIN);
    await createUser("Jane","Smith","jane.smith@stagecommisie.com","hashedPasswordnotfound",ROLES.STAGECOMMISIE);
    await createUser("Alex","Jones","alex.jones@school.com","notAPassword",ROLES.STUDENT);
    await createUser("Emily","Brown","emily.brown@something.com","noPassword",ROLES.STAGEMENTOR)
    await createUser("ariga","toe","arigatoe@html.com","IlikeToes",ROLES.STUDENT);

    console.log("Successfully seeded 5 users into the database!");
    //                                                    year-month-day
    await createStage("doe iets",status.DOCUMENTGEUPLOADED,"2020-1-20","2021-10-12")

  } catch (error) {
    console.error("Error seeding database:", error);
  }
  //closes the connection for some reason...
  //finally {
  //   // 4. Safely shut down connection
  //   await sequelize.close();
  //   console.log("Database connection closed.");
  // }
};

export default seedDatabase;