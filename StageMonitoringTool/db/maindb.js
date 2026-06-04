import { configDotenv } from "dotenv";
import sequelize from "./dbConnection.js";
import "./userModel/user.js"

const sync_DB = async() => {
   await sequelize.sync({force: true})
}

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Since User is imported here, Sequelize now knows the model exists and will sync it!
    await sequelize.sync({ alter: true });
    console.log('Tables have been created/updated successfully!');

  } catch (error) {
    console.error('Unable to connect to the database or create tables:', error);
  } finally {
    await sequelize.close();
  }
};

sync_DB();
run();