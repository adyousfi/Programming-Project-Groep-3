import { configDotenv } from "dotenv";
import { Sequelize } from "sequelize";
configDotenv(); 

//initialising the connection with the database
const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
  host: 'localhost',
  dialect: 'mysql'
});

//making the connection with the database
const run = async () => {
  if (!sequelize) {
    console.error('No database configuration selected.');
    return;
  }

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true }); 
    console.log('Tables have been reset and created successfully!');

  } catch (error) {
    console.error('Unable to connect to the database or create tables:', error);
  } finally {
    setTimeout(async () => {
      await sequelize.close();
      console.log('Database connection closed safely.');
    }, 500);
  }
};

export {sequelize, run};