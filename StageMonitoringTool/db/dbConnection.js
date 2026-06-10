import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Always load env file relative to THIS file (prevents "env not loaded" when started from another folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

function requireEnv(name) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing/empty environment variable: ${name}`);
  }
  return value;
}

const dbName = process.env.DB;
const dbUser = process.env.USER;
const dbPassword = process.env.PASSWORD;

// Initialize the connection with the database
const sequelize = new Sequelize(dbName || '', dbUser || '', dbPassword || '', {
  host: 'localhost',
  dialect: 'mysql'
});

const run = async () => {
  try {
    // Fail fast with a clearer error
    requireEnv('DB');
    requireEnv('USER');
    requireEnv('PASSWORD');

    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // doesn't drop the tables (sync is still potentially destructive in other configs)
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database or create tables:', error);
    process.exitCode = 1;
  }
};

export { sequelize, run };

