import { configDotenv } from "dotenv";
import { Sequelize } from "sequelize";
configDotenv(); 

//initialising the connection with the database
//MySQL
// const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
//   host: 'localhost',
//   dialect: 'mysql'
// });

// Azure
const sequelize = new Sequelize(
  'programmingproject3', 
  'programmingproject3', 
  'EhbProjectGroep3', 
  {
    host: 'programmingproject3.database.windows.net', // Found in Azure portal
    dialect: 'mssql',
    port: 1433,                                    // Default Azure SQL port
    dialectOptions: {
      options: {
        encrypt: true,                             // CRITICAL: Azure SQL requires this
        trustServerCertificate: false              // Set to true only if using self-signed certs in dev
      }
    },
  }
);

//making the connection with the database
const run = async () => {
  if (!sequelize) {
    console.error('No database configuration selected.');
    return;
  }

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    //drops all the tables 
    // await sequelize.sync({ force: false });
    // console.log('Tables have been reset and created successfully!'); 
    //doesn't drop the tables
    await sequelize.sync();

  } catch (error) {
    console.error('Unable to connect to the database or create tables:', error);
  } 
  
  // finally {
  //   setTimeout(async () => {
  //     await sequelize.close();
  //     console.log('Database connection closed safely.');
  //   }, 500);
  // }
};

export {sequelize, run};