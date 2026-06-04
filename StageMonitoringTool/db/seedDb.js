// db/seed.js
import { ENUM } from "sequelize";
import {sequelize} from "./dbConnection.js";
import User from "./userModel/user.js";

const user1 = ({
    first_name: "huh",
    last_name: "hah",
    email: "helnah@hotmail.com",
    password: "hashpassword",
})

const dummyUsers = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@school.com",
    password: "hashed_password_123", // Ideally hashed using bcrypt
  },
  {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@school.com",
    password: "hashed_password_456",
  },
  {
    first_name: "Alex",
    last_name: "Jones",
    email: "alex.jones@student.com",
    password: "hashed_password_789",
  },
  {
    first_name: "Emily",
    last_name: "Brown",
    email: "emily.brown@student.com",
    password: "hashed_password_abc",
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
    console.log("Successfully seeded 5 users into the database!");

  } catch (error) {
    console.error("Error seeding database:", error);
  }
  //closes the connection for some reason...
  //finally {
  //   // 4. Safely shut down connection
  //   await sequelize.close();
  //   console.log("Database connection closed.");
  // }
};

export default seedDatabase;