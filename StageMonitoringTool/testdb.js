import { Sequelize } from 'sequelize';

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

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to Azure SQL!');
  } catch (error) {
    console.error('Unable to connect to Azure SQL database:', error);
  }
}

testConnection();