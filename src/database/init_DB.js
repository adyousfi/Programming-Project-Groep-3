import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config()
// Making the connection
const sequelize = new Sequelize(process.env.DB ,process.env.USER ,process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: "mysql"
});
export default sequelize;
