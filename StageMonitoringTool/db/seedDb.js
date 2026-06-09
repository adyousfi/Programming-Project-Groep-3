// db/seed.js
import { ENUM } from "sequelize";
import {sequelize} from "./dbConnection.js";
import User, { ROLES } from "./userModel/user.js";
import userController from "./userControllers/userController.js";
import createStage from "./userControllers/stageController.js";
import { status } from "./objectModel/stage.js";
import { createBedrijf } from "./objectControllers/bedrijfController.js";
import { createStagementor } from "./userControllers/stagementorController.js";
import { linkBedrijfToStageMentor } from "./objectControllers/bedrijfController.js";
import { linkStageToMoreUser } from "./objectControllers/stageController.js";


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
    
    await User.create("jon","hys","hys.jon@html.com","passwrd",ROLES.STUDENT,"0493998987");
    await User.create("John","Doe","john.doe@school.com","hashed_password_123",ROLES.DOCENT);
    await User.create("huh","hah","helnah@hotmail.com","hashpassword", ROLES.ADMIN);
    await User.create("Jane","Smith","jane.smith@stagecommisie.com","hashedPasswordnotfound",ROLES.STAGECOMMISIE);
    await User.create("Alex","Jones","alex.jones@school.com","notAPassword",ROLES.STUDENT);
    await User.create("Emily","Brown","emily.brown@something.com","noPassword",ROLES.STAGEMENTOR)
    await User.create("ariga","toe","arigatoe@html.com","IlikeToes",ROLES.STUDENT);
    await User.create()
    await User.create("some","dude","some.dude@something.com","whatisdas",ROLES.STAGEMENTOR)
    await User.create("some","other","some.other@something.com","whatisdas",ROLES.STAGEMENTOR)

    await createBedrijf("aqua","finland");
    await createBedrijf("kanker","kankerstraat");
    
    await linkBedrijfToStageMentor(6,1);
    await linkBedrijfToStageMentor(8,1);


    await createStage("doe iets",status.DOCUMENTGEUPLOADED,"2020-1-20","2021-10-12")
    
    await linkStageToMoreUser(1,1,2,6,1);


    console.log("Successfully seeded 5 users into the database!");
    //                                                    year-month-day
    

    

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