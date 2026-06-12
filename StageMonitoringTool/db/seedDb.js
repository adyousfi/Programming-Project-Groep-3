// db/seed.js
import { ENUM } from "sequelize";
import { sequelize } from "./dbConnection.js";
import User, { ROLES } from "./userModel/user.js";
import { createUserCore } from "./userControllers/userController.js";
import { createStageCore } from "./objectControllers/stageController.js";
import { status } from "./objectModel/stage.js";
import { createBedrijfCore } from "./objectControllers/bedrijfController.js";
import { createStagementor, linkStagementorToBedrijf } from "./userControllers/stagementorController.js";

// Import models first so associations/foreign keys exist before sync({ force: true })
import Student from "./userModel/student.js";
import Stagementor from "./userModel/stagementor.js";
import Stagecommisie from "./userModel/stagecommisie.js";
import Admin from "./userModel/admin.js";
import Docent from "./userModel/docent.js";

import Stage from "./objectModel/stage.js";
import StageDocument from "./objectModel/stageDocument.js";
import Bedrijf from "./objectModel/bedrijf.js";

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
    
    await createUserCore("Jan","Student","jan@student.com","wachtwoord",ROLES.STUDENT,"0493998987");
    await createUserCore("Pieter","Peer","pieter@student.com","wachtwoord",ROLES.STUDENT);
    await createUserCore("Sara","Docent","sara@docent.com","wachtwoord",ROLES.DOCENT);
    await createUserCore("Admin","Beheer","admin@admin.com","wachtwoord",ROLES.ADMIN);
    await createUserCore("Lia","Commissie","lia@commissie.com","wachtwoord",ROLES.STAGECOMMISIE);
    await createUserCore("Tom","Mentor","tom@mentor.com","wachtwoord",ROLES.STAGEMENTOR);

    await createBedrijfCore("aqua","finland");
    await createBedrijfCore("kanker","kankerstraat");
    
    await linkStagementorToBedrijf(6,1);


    console.log("Successfully seeded 6 users into the database!");
    //                                                    year-month-day
    await createStageCore("doe iets",status.DOCUMENTGEUPLOADED,"2020-1-20","2021-10-12")

    

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