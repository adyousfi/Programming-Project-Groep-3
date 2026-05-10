import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from 'sequelize';


// Replace with your actual database, username, and password
// This makes a connection with your local database.
const sequelize = new Sequelize(process.env.DB!, process.env.USER!, process.env.PASSWORD!, {
    host: process.env.HOST,
    dialect: 'mysql',
    logging: true,
});


// This test your connection with your local database
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

export default sequelize;