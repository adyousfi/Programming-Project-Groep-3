import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config()
console.log("testing database...");

// Making the connection
const sequelize = new Sequelize(process.env.DB ,process.env.USER ,process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: "mysql"
});

// Test the connection
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
