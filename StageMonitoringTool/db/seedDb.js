// db/seed.js
import {sequelize} from "./dbConnection.js";
import User, { ROLES } from "./userModel/user.js";
import Stage from "./objectModel/stage.js";
import Student from "./userModel/student.js";
import Stagementor from "./userModel/stagementor.js";
import Stagecommisie from "./userModel/stagecommisie.js";
import Admin from "./userModel/admin.js";
import Docent from "./userModel/docent.js";
import Bedrijf from "./objectModel/bedrijf.js";
import bedrijfController from "./objectControllers/bedrijfController.js";
 
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

    // // Temporarily turn off foreign key safety guards
    // await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Now Sequelize can wipe and recreate all tables cleanly with your new CASCADE rules
    await sequelize.sync({ force: true });

    // Turn the safety guards back on
    // await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');    
    
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
     
      console.log("Seeding companies (bedrijven)...");
      await Bedrijf.bulkCreate([
          { naam: "Aqua", address: "Finland" },
          { naam: "Horeca Partner", address: "Brussel" }
      ]);
 
    console.log("Seeding stages...");
      await Stage.bulkCreate([
    {
        student_id: 1,       // Alex (Student)
        docent_id: 13,      // Prof. Arthur (Docent)
        stagementor_id: 4,       // Mark (Stagementor)
        bedrijf_id: 1,      // Aqua
        omschrijving_opdracht: "Ontwikkelen van een full-stack monitoring tool met React en Node.js.",
        status: "DOCUMENTGEUPLOADED", // Komt exact overeen met de status object waarden
        begin_datum: new Date("2026-09-01"),
        eind_datum: new Date("2027-01-31")
    },
    {
        student_id: 2,       // Emma (Student)
        docent_id: 14,      // Prof. Elena (Docent)
        stagementor_id: 5,       // Sophie (Stagementor)
        bedrijf_id: 2,      // Horeca Partner
        omschrijving_opdracht: "Optimaliseren van de database structuren en SQL queries voor grootschalige data-analyse.",
        status: "GOEDGEKEURD",
        begin_datum: new Date("2026-09-15"),
        eind_datum: new Date("2027-02-15")
    },
    {
        student_id: 3,       // Lucas (Student)
        docent_id: 13,      // Prof. Arthur (Docent)
        stagementor_id: 6,       // Thomas (Stagementor)
        bedrijf_id: 1,      // Aqua
        omschrijving_opdracht: "Onderzoek doen naar cloud migratie en het opzetten van CI/CD pipelines in Azure.",
        status: "AANVRAAG",
        begin_datum: new Date("2026-10-01"),
        eind_datum: new Date("2027-03-01")
    }
]);
   


    console.log("Seeding competenties (competenties + rubrieken)...");

    const standaardRubrieken = [
      { score: 1, beschrijving: 'Onvoldoende: de uitvoering is onvolledig en niet consistent.' },
      { score: 2, beschrijving: 'Basis: de kern is aanwezig maar vereist nog begeleiding/verbetering.' },
      { score: 3, beschrijving: 'Voldoende/Goed: competent op basisniveau, met duidelijke output.' },
      { score: 4, beschrijving: 'Sterk: toont structuur, toepasbaarheid en kwaliteitsbewaking.' },
      { score: 5, beschrijving: 'Uitmuntend: zeer hoog niveau, efficiënt, betrouwbaar en onderbouwd.' },
    ];

    // Basis-element: LO's als competenties, met 5 generieke rubriekniveaus (score 1..5)
    const competentiesPayload = [
      {
        code: 'TI_LO01_22-23',
        titel: 'LO1 - Beheersing van het planningsproces',
        omschrijving:
          'De lerende professional beheerst het volledige project - of operationeel planningsproces.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO02_22-23',
        titel: 'LO2 - Ontwerpen IT-oplossingen',
        omschrijving: 'De lerende professional ontwerpt IT-oplossingen volgens de industriestandaarden.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO03_22-23',
        titel: 'LO3 - Implementatie digitale producten',
        omschrijving: 'De lerende professional implementeert digitale producten in een professionele omgeving.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO04_22-23',
        titel: 'LO4 - Integratie technologie en infrastructuur',
        omschrijving:
          'De lerende professional integreert technologie en infrastructuur binnen een professionele omgeving.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO05_22-23',
        titel: 'LO5 - Onderzoekende houding',
        omschrijving: 'De lerende professional hanteert een onderzoekende houding om tot innovatieve oplossingen te komen.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO06_22-23',
        titel: 'LO6 - Helder en transparant communiceren',
        omschrijving:
          'De lerende professional communiceert helder en transparant in een professionele omgeving en/of in teamverband.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO07_22-23',
        titel: 'LO7 - Probleemoplossend vermogen',
        omschrijving: 'De lerende professional denkt kritisch na om problemen efficiënt en effectief op te lossen.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO08_22-23',
        titel: 'LO8 - Persoonlijke ontwikkeling',
        omschrijving:
          'De lerende professional ziet persoonlijke ontwikkeling als de basis voor professionele groei.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO09_22-23',
        titel: 'LO9 - Professionele attitude',
        omschrijving: 'De lerende professional ontwikkelt een professionele attitude en handelt kwaliteitsvol.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO10_22-23',
        titel: 'LO10 - Ondernemend handelen',
        omschrijving: 'De lerende professional demonstreert ondernemend handelen in functie van waardecreatie.',
        gewicht_percentage: 10,
      },
      {
        code: 'TI_LO11_22-23',
        titel: 'LO11 - Ethisch en deontologisch handelen',
        omschrijving: 'De lerende professional handelt ethisch en deontologisch.',
        gewicht_percentage: 10,
      },
    ];

    const competenties = await Competentie.bulkCreate(competentiesPayload);

    // Rubrieken: 1..N per competentie (5 niveaus)
    const rubriekenPayload = [];
    for (const comp of competenties) {
      for (const r of standaardRubrieken) {
        rubriekenPayload.push({
          competentie_id: comp.competentie_id,
          score: r.score,
          beschrijving: r.beschrijving,
        });
      }
    }

    await Rubriek.bulkCreate(rubriekenPayload);

    console.log("Successfully seeded users, competenties and rubrieken!");

   
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
 
export default seedDatabase;