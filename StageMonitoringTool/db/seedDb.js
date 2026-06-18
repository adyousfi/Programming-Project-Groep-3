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
// NOTE: deze twee imports ontbraken in de originele file maar Competentie/Rubriek
// werden wel gebruikt -> pas het pad aan naar waar jouw modellen effectief staan.
import Competentie from "./objectModel/competentie.js";
import Rubriek from "./objectModel/rubriek.js";
import bcrypt from "bcryptjs";

const dummyUsers = [
    // --- STUDENTS ---
    { first_name: "Alex", last_name: "De Smet", email: "alex.desmet@student.com", password: "test", role: ROLES.STUDENT, phone: "0470111111" },
    { first_name: "Emma", last_name: "Peeters", email: "emma.peeters@student.com", password: "test", role: ROLES.STUDENT, phone: "0470222222" },
    { first_name: "Lucas", last_name: "Maes", email: "lucas.maes@student.com", password: "test", role: ROLES.STUDENT, phone: "0470333333" },

    // --- STAGEMENTORS ---
    { first_name: "Mark", last_name: "Janssens", email: "mark@company-a.com", password: "test", role: ROLES.STAGEMENTOR, phone: "0480111111" },
    { first_name: "Sophie", last_name: "Willems", email: "sophie@company-b.com", password: "test", role: ROLES.STAGEMENTOR, phone: "0480222222" },
    { first_name: "Thomas", last_name: "Claes", email: "thomas@company-c.com", password: "test", role: ROLES.STAGEMENTOR, phone: "0480333333" },

    // --- ADMINS ---
    { first_name: "Sarah", last_name: "Mertens", email: "sarah.admin@school.com", password: "test", role: ROLES.ADMIN, phone: "0490111111" },
    { first_name: "David", last_name: "Goossens", email: "david.admin@school.com", password: "test", role: ROLES.ADMIN, phone: "0490222222" },
    { first_name: "Elena", last_name: "Dubois", email: "elena.admin@school.com", password: "test", role: ROLES.ADMIN, phone: "0490333333" },

    // --- STAGECOMMISIE ---
    { first_name: "Jan", last_name: "Pauwels", email: "jan.commisie@school.com", password: "test", role: ROLES.STAGECOMMISIE, phone: "0450111111" },
    { first_name: "Lisa", last_name: "Vandenberghe", email: "lisa.commisie@school.com", password: "test", role: ROLES.STAGECOMMISIE, phone: "0450222222" },
    { first_name: "Daan", last_name: "Wauters", email: "daan.commisie@school.com", password: "test", role: ROLES.STAGECOMMISIE, phone: "0450333333" },

    // --- DOCENTEN ---
    { first_name: "Prof. Arthur", last_name: "Devries", email: "arthur.docent@school.com", password: "test", role: ROLES.DOCENT, phone: "0460111111" },
    { first_name: "Prof. Elena", last_name: "Dumont", email: "elena.docent@school.com", password: "test", role: ROLES.DOCENT, phone: "0460222222" },
    { first_name: "Prof. Bram", last_name: "Vermeulen", email: "bram.docent@school.com", password: "test", role: ROLES.DOCENT, phone: "0460333333" }
];

// ---------------------------------------------------------------------------
// COMPETENTIES (= de 11 leerresultaten/LO's uit het document)
// niveau & categorie komen 1-op-1 uit de kolommen "Niveau" en "Categorie"
// ---------------------------------------------------------------------------
const competentiesPayload = [
  {
    code: 'TI_LO01_22-23',
    titel: 'LO1 - Beheersing van het planningsproces',
    omschrijving: 'De lerende professional beheerst het volledige project - of operationeel planningsproces.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO02_22-23',
    titel: 'LO2 - Ontwerpen IT-oplossingen',
    omschrijving: 'De lerende professional ontwerpt IT-oplossingen volgens de industriestandaarden.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO03_22-23',
    titel: 'LO3 - Implementatie digitale producten',
    omschrijving: 'De lerende professional implementeert digitale producten in een professionele omgeving.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO04_22-23',
    titel: 'LO4 - Integratie technologie en infrastructuur',
    omschrijving: 'De lerende professional integreert technologie en infrastructuur binnen een professionele omgeving.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO05_22-23',
    titel: 'LO5 - Onderzoekende houding',
    omschrijving: 'De lerende professional hanteert een onderzoekende houding om tot innovatieve oplossingen te komen.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO06_22-23',
    titel: 'LO6 - Helder en transparant communiceren',
    omschrijving: 'De lerende professional communiceert helder en transparant in een professionele omgeving en/of in teamverband.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO07_22-23',
    titel: 'LO7 - Probleemoplossend vermogen',
    omschrijving: 'De lerende professional denkt kritisch na om problemen efficiënt en effectief op te lossen.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO08_22-23',
    titel: 'LO8 - Persoonlijke ontwikkeling',
    omschrijving: 'De lerende professional ziet persoonlijke ontwikkeling als de basis voor professionele groei.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO09_22-23',
    titel: 'LO9 - Professionele attitude',
    omschrijving: 'De lerende professional ontwikkelt een professionele attitude en handelt kwaliteitsvol.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO10_22-23',
    titel: 'LO10 - Ondernemend handelen',
    omschrijving: 'De lerende professional demonstreert ondernemend handelen in functie van waardecreatie.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
  {
    code: 'TI_LO11_22-23',
    titel: 'LO11 - Ethisch en deontologisch handelen',
    omschrijving: 'De lerende professional handelt ethisch en deontologisch.',
    niveau: 'Gespecialiseerd',
    categorie: 'DLR',
    gewicht_percentage: 10,
  },
];

// ---------------------------------------------------------------------------
// RUBRIEKEN (= de generieke indicatoren "GI x.x" per leerresultaat)
// Key = competentie code waaraan ze hangen, gebruikt om competentie_id te koppelen.
// volgnummer = positie binnen die competentie (1, 2, 3 ...)
// ---------------------------------------------------------------------------
const rubriekenPerCompetentie = {
  'TI_LO01_22-23': [
    { code: 'TI - GI.1.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 1.1: De lerende professional bepaalt activiteiten en verantwoordelijkheden en identificeert kritische mijlpalen, middelen en interfaces om de kosten en tijdsbesteding in projecten te optimaliseren.' },
    { code: 'TI - GI.1.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 1.2: De lerende professional definieert de vereisten van het werkveld met het oog op het ontwikkelen van de planning voor het project.' },
    { code: 'TI - GI.1.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 1.3: De lerende professional houdt rekening met de implicaties van digitale transformatie, mogelijke digitale ontwrichting en verandering.' },
    { code: 'TI - GI.1.4_22-23K,I,V,A', score: 4, beschrijving: 'GI 1.4: De lerende professional beheerst de nodige tools om de voortgang van een project nauwkeurig op te volgen.' },
    { code: 'TI - GI.1.5_22-23K,I,V,A', score: 5, beschrijving: 'GI 1.5: De lerende professional plant de deadlines en het budget in overeenstemming met de oorspronkelijke eisen en houdt hierbij rekening met mogelijke veranderende omstandigheden.' },
  ],
  'TI_LO02_22-23': [
    { code: 'TI - GI.2.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 2.1: De lerende professional hanteert een iteratief proces bij het ontwikkelen van de IT-architectuur rekening houdend met de vereisten van het bedrijfsleven, het management en de data- en informatie-infrastructuur.' },
    { code: 'TI - GI.2.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 2.2: De lerende professional identificeert bij veranderingsvereisten betrokken componenten zoals hardware, software, applicaties, processen, diensten en informatie- en technologieplatformen.' },
    { code: 'TI - GI.2.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 2.3: De lerende professional beheerst verschillende software-ontwikkelingsmodellen om een oplossing te bedenken in overeenstemming met het IT-beleid en gebruikers- en klantbehoeften.' },
    { code: 'TI - GI.2.4_22-23K,I,V,A', score: 4, beschrijving: 'GI 2.4: De lerende professional selecteert de juiste technische opties voor applicatieontwerp waarbij de balans tussen kosten en kwaliteit wordt geoptimaliseerd.' },
    { code: 'TI - GI.2.5_22-23K,I,V,A', score: 5, beschrijving: 'GI 2.5: De lerende professional ontwerpt intuïtieve en gebruiksvriendelijke digitale producten en past hierbij de principes van mens-computer-interactie toe.' },
  ],
  'TI_LO03_22-23': [
    { code: 'TI - GI.3.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 3.1: De lerende professional analyseert het applicatie-, integratie- en dataontwerp om een geschikte applicatie te ontwikkelen rekening houdend met de behoeften van de klant.' },
    { code: 'TI - GI.3.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 3.2: De lerende professional codeert, debugt en test de applicatie/ IT-oplossing in elke ontwikkelingsfase.' },
    { code: 'TI - GI.3.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 3.3: De lerende professional genereert documentatie die voldoet aan de behoeften van klanten, technische en ICT-applicatieontwikkelingsprocessen.' },
    { code: 'TI - GI.3.4_22-23K,I,V,A', score: 4, beschrijving: 'GI 3.4: De lerende professional integreert hardware- en/of software-componenten in een bestaand of nieuw systeem.' },
    { code: 'TI - GI.3.5_22-23K,I,V,A', score: 5, beschrijving: 'GI 3.5: De lerende professional doet aan kwaliteitscontrole door de efficiëntie, kosten en beveiliging te optimaliseren.' },
  ],
  'TI_LO04_22-23': [
        { code: 'TI - GI.3.6_22-23K,I,V,A', score: 1, beschrijving: 'GI 3.6: De lerende professional valideert tussentijdse resultaten met de gebruikersvertegenwoordigers.' },
    { code: 'TI - GI.4.1_22-23K,I,V,A', score: 2, beschrijving: 'GI 4.1: De lerende professional hanteert een systematische methodologie om infrastructuurplatforms of oplossingen te ontwikkelen die voldoen aan zakelijke en technische vereisten.' },
    { code: 'TI - GI.4.2_22-23K,I,V,A', score: 3, beschrijving: 'GI 4.2: De lerende professional bouwt systemen waarbinnen fysieke en virtuele apparaten, netwerken en hardware- en/of softwarecomponenten worden geïntegreerd.' },
    { code: 'TI - GI.4.3_22-23K,I,V,A', score: 4, beschrijving: 'GI 4.3: De lerende professional beheert netwerken, componenten en interfaces.' },
        { code: 'TI - GI.5.1_22-23K,I,V,A', score: 5, beschrijving: 'GI 5.1: De lerende professional is op de hoogte van de nieuwste technologische ICT-ontwikkelingen en methodologieën.' },

  ],
  'TI_LO05_22-23': [
    { code: 'TI - GI.6.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 6.1: De lerende professional presenteert geargumenteerde standpunten en beslissingen via een pitch in nationale én internationale contexten.' },
    { code: 'TI - GI.5.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 5.2: De lerende professional bedenkt effectieve oplossingen bij het aanbieden van nieuwe concepten, ideeën, producten en/of diensten.' },
    { code: 'TI - GI.5.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 5.3: De lerende professional ziet experiment en kritisch denken als belangrijk onderdeel van levenslang leren en ontwikkeling.' },
    { code: 'TI - GI.6.1_22-23K,I,V,A', score: 4, beschrijving: 'GI 6.1: De lerende professional presenteert geargumenteerde standpunten en beslissingen via een pitch in nationale én internationale contexten.' },
    { code: 'TI - GI.6.1_22-23K,I,V,A', score: 5, beschrijving: 'GI 6.1: De lerende professional presenteert geargumenteerde standpunten en beslissingen via een pitch in nationale én internationale contexten.' },

  ],
  'TI_LO06_22-23': [
    { code: 'TI - GI.6.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 6.1: De lerende professional presenteert geargumenteerde standpunten en beslissingen via een pitch in nationale én internationale contexten.' },
    { code: 'TI - GI.6.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 6.2: De lerende professional communiceert op gepaste wijze met uitvoerders, opdrachtgevers, eindgebruikers en collega\'s in het Nederlands en Engels.' },
    { code: 'TI - GI.6.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 6.3: De lerende professional communiceert en beargumenteert op overzichtelijke wijze een businessplan aan de belanghebbenden.' },
    { code: 'TI - GI.6.4_22-23K,I,V,A', score: 4, beschrijving: 'GI 6.4: De young professional voert kritische discussies op basis van gegronde argumenten.' },
    { code: 'TI - GI.6.5_22-23K,I,V,A', score: 5, beschrijving: 'GI 6.5: De young professional ontwikkelt en onderhoudt positieve, zakelijke relaties in een diverse stakeholderomgeving en werkt samen met verschillende partners in een multidisciplinaire teamwerking.' },
   
  ],
  'TI_LO07_22-23': [
    { code: 'TI - GI.7.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 7.1: De lerende professional gebruikt gestandaardiseerde analyse- en modelleringstechnieken om een probleem op te delen in hanteerbare deelproblemen en op deze manier efficiënt tot een oplossing te komen.' },
    { code: 'TI - GI.7.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 7.2: De lerende professional identificeert de hoofdoorzaak van een incident en/of een complex probleem en lost deze structureel op.' },
    { code: 'TI - GI.7.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 7.3: De lerende professional zorgt voor een kwaliteitsvol resultaat.' },
     { code: 'TI - GI.6.6_22-23K,I,V,A', score: 4, beschrijving: 'GI 6.6: De young professional houdt rekening met interculturele verschillen en perspectieven in de communicatie met collega\'s, klanten, partners en leveranciers.' },
    { code: 'TI - GI.6.7_22-23K,I,V,A', score: 5, beschrijving: 'GI 6.7: De young professional lost complexe vraagstukken en cases op door co-creatie en samenwerking met een complementair team.' },
  ],
  'TI_LO08_22-23': [
    { code: 'TI - GI.8.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 8.1: De lerende professional gebruikt reflectie en zelfsturing om persoonlijke doelen te stellen en deze bij te sturen waar nodig.' },
    { code: 'TI - GI.8.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 8.2: De lerende professional heeft inzicht in de eigen sterktes, detecteert verbeterpunten en pakt deze aan door in te zetten op persoonlijke ontwikkeling of co-creatie.' },
    { code: 'TI - GI.8.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 8.3: De lerende professional doet actief aan zelfontplooiing en -ontwikkeling en stemt zijn ambities hierop af, in functie van zijn loopbaanontwikkeling.' },
     { code: 'TI - GI.6.6_22-23K,I,V,A', score: 4, beschrijving: 'GI 6.6: De young professional houdt rekening met interculturele verschillen en perspectieven in de communicatie met collega\'s, klanten, partners en leveranciers.' },
    { code: 'TI - GI.6.7_22-23K,I,V,A', score: 5, beschrijving: 'GI 6.7: De young professional lost complexe vraagstukken en cases op door co-creatie en samenwerking met een complementair team.' },
  ],
  'TI_LO09_22-23': [
    { code: 'TI - GI.9.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 9.1: De lerende professional beschikt over een aanpassingsvermogen om zich als humanist te integreren in een interculturele en multidisciplinaire omgeving.' },
    { code: 'TI - GI.9.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 9.2: De lerende professional gebruikt gedefinieerde standaarden om doelstellingen te creëren voor informatiebeveiliging en gegevensprivacy.' },
    { code: 'TI - GI.9.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 9.3: De lerende professional schat bedreigingen proactief in en zoekt daarbij naar relevante oplossingen.' },
    { code: 'TI - GI.9.4_22-23K,I,V,A', score: 4, beschrijving: 'GI 9.4: De young professional respecteert de missie en visie van de organisatie op vlak van informatie- en systeembeveiliging.' },
    { code: 'TI - GI.6.7_22-23K,I,V,A', score: 5, beschrijving: 'GI 6.7: De young professional lost complexe vraagstukken en cases op door co-creatie en samenwerking met een complementair team.' },

  ],
  'TI_LO10_22-23': [
    { code: 'TI - GI.10.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 10.1: De lerende professional heeft inzicht in de IT-systemen en modelleert op gepaste wijze bedrijfsprocessen.' },
    { code: 'TI - GI.10.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 10.2: De lerende professional beargumenteert ambitie, passie en zelfzekerheid en stemt het handelen daar optimaal op af.' },
    { code: 'TI - GI.10.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 10.3: De lerende professional ontwikkelt strategieën om middelen te mobiliseren en waarde te genereren.' },
    { code: 'TI - GI.10.4_22-23K,I,V,A', score: 4, beschrijving: 'GI 10.4: De lerende professional gebruikt economische rentabiliteit als kritische succesfactor bij de keuze en uitvoering van een oplossing.' },
    { code: 'TI - GI.10.5_22-23K,I,V,A', score: 5, beschrijving: 'GI 10.5: De lerende professional draagt bij tot de procesefficiëntie en effectiviteit van de organisatie.' },
  ],
  'TI_LO11_22-23': [
    { code: 'TI - GI.11.1_22-23K,I,V,A', score: 1, beschrijving: 'GI 11.1: De lerende professional analyseert de vooruitzichten en effecten op de sociale en financiële duurzaamheid van ICT-projecten, -ontwikkelingen, -diensten en -operaties.' },
    { code: 'TI - GI.11.2_22-23K,I,V,A', score: 2, beschrijving: 'GI 11.2: De lerende professional handelt in overeenstemming met de in de context geldende wetgeving en regelgeving.' },
    { code: 'TI - GI.11.3_22-23K,I,V,A', score: 3, beschrijving: 'GI 11.3: De lerende professional formuleert advies naar klanten en stakeholders over duurzame opties die passen bij de bedrijfsstrategie.' },
    { code: 'TI - GI.11.4_22-23K,I,V,A', score: 4, beschrijving: 'GI 11.4: De lerende professional schat de ecologische, ethische en maatschappelijke impact van ICT-oplossingen in.' },
    { code: 'TI - GI.6.7_22-23K,I,V,A', score: 5, beschrijving: 'GI 6.7: De young professional lost complexe vraagstukken en cases op door co-creatie en samenwerking met een complementair team.' },

  ],
};

const seedDatabase = async () => {
  try {
    // 1. Ensure connection is alive
    await sequelize.authenticate();
    console.log("Connected to database for seeding...");

    // 2. Clear existing data and recreate the tables fresh
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log("Tables reset cleanly.");

    console.log("Starting user database seeding...");

    for (const userData of dummyUsers) {
        const hashedPassword = await bcrypt.hash("test", 10);
        const user = await User.create({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: hashedPassword,
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
        student_id: 1,
        docent_id: 13,
        stagementor_id: 4,
        bedrijf_id: 1,
        omschrijving_opdracht: "Ontwikkelen van een full-stack monitoring tool met React en Node.js.",
        status: "DOCUMENTGEUPLOADED",
        begin_datum: new Date("2026-09-01"),
        eind_datum: new Date("2027-01-31")
    },
    {
        student_id: 2,
        docent_id: 14,
        stagementor_id: 5,
        bedrijf_id: 2,
        omschrijving_opdracht: "Optimaliseren van de database structuren en SQL queries voor grootschalige data-analyse.",
        status: "GOEDGEKEURD",
        begin_datum: new Date("2026-09-15"),
        eind_datum: new Date("2027-02-15")
    },
    {
        student_id: 3,
        docent_id: 13,
        stagementor_id: 6,
        bedrijf_id: 1,
        omschrijving_opdracht: "Onderzoek doen naar cloud migratie en het opzetten van CI/CD pipelines in Azure.",
        status: "AANVRAAG",
        begin_datum: new Date("2026-10-01"),
        eind_datum: new Date("2027-03-01")
    }
]);

    console.log("Seeding competenties en hun rubrieken (LO's + GI-indicatoren)...");
    // Per competentie individueel aanmaken (in plaats van bulkCreate) zodat we
    // altijd zeker zijn van het effectief gegenereerde competentie_id, en daarmee
    // meteen de bijhorende rubrieken correct koppelen. bulkCreate geeft bij sommige
    // SQL-dialecten de auto-increment id's niet altijd terug, wat de koppeling
    // hieronder zou laten falen.
    for (const compData of competentiesPayload) {
      const competentie = await Competentie.create(compData);

      const gis = rubriekenPerCompetentie[competentie.code] || [];
      const rubriekenPayload = gis.map((gi, index) => ({
        competentie_id: competentie.competentie_id,
        volgnummer: index + 1,
        code: gi.code,
        beschrijving: gi.beschrijving,
      }));

      if (rubriekenPayload.length > 0) {
        await Rubriek.bulkCreate(rubriekenPayload);
      }
    }

    console.log("Successfully seeded users, competenties and rubrieken!");

  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export default seedDatabase;