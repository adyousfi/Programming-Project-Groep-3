import { configDotenv } from "dotenv";
import sequelize from "./dbConnection.js";
import "./userModel/user.js"

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // 1. Clear any broken state by running a clean sync
    // If { alter: true } is choking on missing indexes, use { force: true } ONCE to rebuild cleanly.
    await sequelize.sync({ force: true }); 
    console.log('Tables have been reset and created successfully!');

  } catch (error) {
    console.error('Unable to connect to the database or create tables:', error);
  } finally {
    // 2. Wrap this in a small timeout or remove it during testing 
    // to allow internal Sequelize retry hooks to clear out first.
    setTimeout(async () => {
      await sequelize.close();
      console.log('Database connection closed safely.');
    }, 500);
  }
};

run();