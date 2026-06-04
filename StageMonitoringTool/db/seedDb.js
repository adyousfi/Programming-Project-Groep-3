// db/seed.js
import { ENUM } from "sequelize";
import sequelize from "./dbConnection.js";
import User, { ROLES } from "./userModel/user.js";

const dummyUsers = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@school.com",
    password: "hashed_password_123", // Ideally hashed using bcrypt
    role: ROLES.ADMIN
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@school.com",
    password: "hashed_password_456",
    role: ROLES.STUDENT
  },
  {
    first_name: "Alex",
    last_name: "Jones",
    email: "alex.jones@student.com",
    password: "hashed_password_789",
    role: ROLES.TEACHER
  },
  {
    first_name: "Emily",
    last_name: "Brown",
    email: "emily.brown@student.com",
    password: "hashed_password_abc",
    role: ROLES.STUDENT
  }
];

const seedDatabase = async () => {
  try {
    // 1. Ensure connection is alive
    await sequelize.authenticate();
    console.log("Connected to database for seeding...");

    // 2. Clear existing data and recreate the tables fresh
    // WARNING: This drops tables. Use { alter: true } or omit if you don't want to lose current data.
    await sequelize.sync({ force: true });
    console.log("Tables reset cleanly.");

    // 3. Bulk insert the dummy data
    await User.bulkCreate(dummyUsers, { validate: true });
    console.log("Successfully seeded 4 users into the database!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // 4. Safely shut down connection
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

export default seedDatabase;