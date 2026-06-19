import { sequelize } from './dbConnection.js';
import dotenv from 'dotenv';

import User from "./userModel/user.js";
import Admin from "./userModel/admin.js";
import Student from "./userModel/student.js";
import Docent from "./userModel/docent.js";
import Stagementor from "./userModel/stagementor.js";
import Stagecommisie from "./userModel/stagecommisie.js";
import Bedrijf from "./objectModel/bedrijf.js";
import Stage from "./objectModel/stage.js";
import Logboek from "./objectModel/logboek.js";
import Evaluatie from "./objectModel/evaluatie.js";
import Competentie from "./objectModel/competentie.js";
import Rubriek from "./objectModel/rubriek.js";

// ==========================================
// RELATIONS
// ==========================================

// --- Users & Sub-rollen (1-op-1) ---
// GEFIXED: Foreign keys moeten exact matchen met de belongsTo hieronder (allemaal user_id)
User.hasOne(Admin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(Docent, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(Stagecommisie, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(Stagementor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(Student, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Inverse relaties voor de sub-rollen
Student.belongsTo(User, { as: 'User', foreignKey: 'user_id', onDelete: 'CASCADE' });
Docent.belongsTo(User, { as: 'User', foreignKey: 'user_id', onDelete: 'CASCADE' });
Stagementor.belongsTo(User, { as: 'User', foreignKey: 'user_id', onDelete: 'CASCADE' });
Stagecommisie.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Admin.belongsTo(User, { as: 'User', foreignKey: 'user_id', onDelete: 'CASCADE' });

// --- Bedrijf & Mentor (1-op-N) ---
// GEFIXED: Als een bedrijf sluit, zetten we de mentor op SET NULL in plaats van de hele user te CASCADEN
Stagementor.belongsTo(Bedrijf, { foreignKey: 'bedrijf_id', onDelete: 'SET NULL' });
Bedrijf.hasMany(Stagementor, { foreignKey: 'bedrijf_id', onDelete: 'SET NULL' });

// --- Stage Relaties ---
// GEFIXED: Alleen Student behoudt CASCADE. De rest gaat naar SET NULL om MSSQL-cycles te voorkomen
Stage.belongsTo(Student, { as: 'student', foreignKey: 'student_id', onDelete: 'CASCADE' });
Stage.belongsTo(Docent, { as: 'docent', foreignKey: 'docent_id', onDelete: 'NO ACTION' });
Stage.belongsTo(Bedrijf, { as: 'bedrijf', foreignKey: 'bedrijf_id', onDelete: 'NO ACTION' });
Stage.belongsTo(Stagementor, { as: 'mentor', foreignKey: 'stagementor_id', onDelete: 'NO ACTION' });

// --- Evaluatie & Stage (1-op-N) ---
Stage.hasMany(Evaluatie, { foreignKey: 'stage_id', onDelete: 'CASCADE' });
Evaluatie.belongsTo(Stage, { foreignKey: 'stage_id' });

// --- Logboek & Opmerkingen ---
Stage.hasMany(Logboek, { foreignKey: 'stage_id', onDelete: 'CASCADE' });
Logboek.belongsTo(Stage, { foreignKey: 'stage_id' });

// --- Competentie & Rubriek (1-op-N) ---
Competentie.hasMany(Rubriek, { foreignKey: 'competentie_id', onDelete: 'CASCADE' });
Rubriek.belongsTo(Competentie, { foreignKey: 'competentie_id' });



export const confirmRelations = "relations are made";