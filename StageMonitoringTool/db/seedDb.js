// db/seed.js
import {sequelize} from "./dbConnection.js";
import User, { ROLES } from "./userModel/user.js";
import stage from "./objectModel/stage.js";
import Student from "./userModel/student.js";
import Stagementor from "./userModel/stagementor.js";
import Stagecommisie from "./userModel/stagecommisie.js";
import Admin from "./userModel/admin.js";
import Docent from "./userModel/docent.js";

const dummyUsers = [
    // --- STUDENTS ---
    { first_name: "Alex", last_name: "De Smet", email: "alex.desmet@student.com", password: "hashedpassword123", role: ROLES.STUDENT, phone: "0470111111" },
    { first_name: "Emma", last_name: "Peeters", email: "emma.peeters@student.com", password: "hashedpassword123", role: ROLES.STUDENT, phone: "0470222222" },
    { first_name: "Lucas", last_name: "Maes", email: "lucas.maes@student.com", password: "hashedpassword123", role: ROLES.STUDENT, phone: "0470333333" },

    // --- STAGEMENTORS ---
    { first_name: "Mark", last_name: "Janssens", email: "mark@company-a.com", password: "hashedpassword123", role: ROLES.STAGEMENTOR, phone: "0480111111" },
    { first_name: "Sophie", last_name: "Willems", email: "sophie@company-b.com", password: "hashedpassword123", role: ROLES.STAGEMENTOR, phone: "0480222222" },
    { first_name: "Thomas", last_name: "Claes", email: "thomas@company-c.com", password: "hashedpassword123", role: ROLES.STAGEMENTOR, phone: "0480333333" },

    // --- ADMINS ---
    { first_name: "Sarah", last_name: "Mertens", email: "sarah.admin@school.com", password: "secureadmin1", role: ROLES.ADMIN, phone: "0490111111" },
    { first_name: "David", last_name: "Goossens", email: "david.admin@school.com", password: "secureadmin2", role: ROLES.ADMIN, phone: "0490222222" },
    { first_name: "Elena", last_name: "Dubois", email: "elena.admin@school.com", password: "secureadmin3", role: ROLES.ADMIN, phone: "0490333333" },

    // --- STAGECOMMISIE ---
    { first_name: "Jan", last_name: "Pauwels", email: "jan.commisie@school.com", password: "hashedpassword123", role: ROLES.STAGECOMMISIE, phone: "0450111111" },
    { first_name: "Lisa", last_name: "Vandenberghe", email: "lisa.commisie@school.com", password: "hashedpassword123", role: ROLES.STAGECOMMISIE, phone: "0450222222" },
    { first_name: "Daan", last_name: "Wauters", email: "daan.commisie@school.com", password: "hashedpassword123", role: ROLES.STAGECOMMISIE, phone: "0450333333" },

    // --- DOCENTEN ---
    { first_name: "Prof. Arthur", last_name: "Devries", email: "arthur.docent@school.com", password: "hashedpassword123", role: ROLES.DOCENT, phone: "0460111111" },
    { first_name: "Prof. Elena", last_name: "Dumont", email: "elena.docent@school.com", password: "hashedpassword123", role: ROLES.DOCENT, phone: "0460222222" },
    { first_name: "Prof. Bram", last_name: "Vermeulen", email: "bram.docent@school.com", password: "hashedpassword123", role: ROLES.DOCENT, phone: "0460333333" }
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

    console.log("Starting user database seeding...");

    for (const userData of dummyUsers) {
        // 1. Create base user entries
        const user = await User.create({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            phone: userData.phone
        })
      switch (userData.role) {
        case ROLES.STUDENT:
            await Student.create({ user_id: user.user_id });
            break;
        case ROLES.STAGEMENTOR:
            await Stagementor.create({ user_id: user.user_id });
            break;
        case ROLES.ADMIN:
            await Admin.create({ user_id: user.user_id });
            break;
        case ROLES.STAGECOMMISIE:
            await Stagecommisie.create({ user_id: user.user_id });
            break;
        case ROLES.DOCENT:
            await Docent.create({ user_id: user.user_id });
            break;
            }
      }
    // await createBedrijf("aqua","finland");
    // await createBedrijf("kanker","kankerstraat");
    
    // await linkBedrijfToStageMentor(6,1);
    // await linkBedrijfToStageMentor(8,1);


    // await createStage("doe iets",status.DOCUMENTGEUPLOADED,"2020-1-20","2021-10-12")
    
    // await linkStageToMoreUser(1,1,2,6,1);


    console.log("Successfully seeded 5 users into the database!");
    //                                                    year-month-day
    

    

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