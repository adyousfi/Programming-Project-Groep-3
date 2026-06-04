// dbConnection.js
import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
  host: 'localhost',
  dialect: 'mysql'
});

// JUST export the connection instance. No sync loop here.
export default sequelize;