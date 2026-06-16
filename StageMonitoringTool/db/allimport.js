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
import Opmerkinglogboek from "./objectModel/opmerkingLogboek.js";
import Behaaldescore from './objectModel/behaaldeScore.js';
import Evaluatie from "./objectModel/evaluatie.js";
import Competentie from "./objectModel/competentie.js";
import Rubriek from "./objectModel/rubriek.js";

//RELATIONS

//Users
User.hasOne(Admin, {foreignKey: 'admin_id',onDelete: 'CASCADE'});
User.hasOne(Docent, {foreignKey: 'docent_id',onDelete: 'CASCADE'});
User.hasOne(Stagecommisie, {foreignKey: 'stagecommisie_id',onDelete: 'CASCADE'});
User.hasOne(Stagementor, {foreignKey: 'user_id',onDelete: 'CASCADE'});
User.hasOne(Student, {foreignKey: 'user_id',onDelete: 'CASCADE'});

//Studenten
Student.belongsTo(User, { as: 'User', foreignKey: 'user_id', onDelete: 'CASCADE' });

//Docenten
Docent.belongsTo(User, { as: 'User', foreignKey: 'user_id', onDelete: 'CASCADE' });

//Stagementors
Stagementor.belongsTo(User, { as: 'User', foreignKey: 'user_id', onDelete: 'CASCADE' });

//Stagecommisie
Stagecommisie.belongsTo(User, {foreignKey: 'user_id',onDelete: 'CASCADE'});

//Admins
Admin.belongsTo(User, {foreignKey: 'user_id',onDelete: 'CASCADE'});

//Bedrijf & Mentor
Stagementor.belongsTo(Bedrijf, { foreignKey: 'bedrijf_id', onDelete: 'CASCADE' });

//Bedrijf
Bedrijf.hasMany(Stagementor, { foreignKey: 'bedrijf_id',onDelete: 'CASCADE'});

//Stage Relaties
Stage.belongsTo(Docent, { as: 'docent', foreignKey: 'docent_id', onDelete: 'CASCADE' });
Stage.belongsTo(Student, { as: 'student', foreignKey: 'student_id', onDelete: 'CASCADE' });
Stage.belongsTo(Bedrijf, { as: 'bedrijf', foreignKey: 'bedrijf_id', onDelete: 'CASCADE' });
Stage.belongsTo(Stagementor, { as: 'mentor', foreignKey: 'stagementor_id', onDelete: 'CASCADE' });
Stage.hasMany(Behaaldescore, { foreignKey: 'stage_id', onDelete: 'CASCADE' });
Stage.hasMany(Logboek, { foreignKey: 'stage_id', onDelete: 'CASCADE' });
Logboek.belongsTo(Stage, { foreignKey: 'stage_id' });
//Logboek & Opmerking Relaties
Opmerkinglogboek.hasMany(Logboek, { foreignKey: 'opmerkinglogboek_id', onDelete: 'CASCADE' });
Logboek.belongsTo(Opmerkinglogboek, { foreignKey: 'opmerkinglogboek_id', onDelete: 'CASCADE'});

//behaaldescore
Behaaldescore.belongsTo(Stage, { foreignKey: 'stage_id',onDelete: 'CASCADE'});
export const confirmRelations = "relations are made";


// --- Competentie & Rubriek (1-op-N) ---
// Één competentie heeft 5 rubrieken. Geen tussentabel nodig!
Competentie.hasMany(Rubriek, { foreignKey: 'competentie_id', onDelete: 'CASCADE' });
Rubriek.belongsTo(Competentie, { foreignKey: 'competentie_id' });

// --- Evaluatie & Stage ---
// Ik neem aan dat een Evaluatie aan een Stage hangt
Stage.hasMany(Evaluatie, { foreignKey: 'stage_id', onDelete: 'CASCADE' });
Evaluatie.belongsTo(Stage, { foreignKey: 'stage_id' });

// --- Evaluatie & De ingevulde Scores (1-op-N) ---
// Één evaluatie-formulier bevat meerdere ingevulde scores (11 in jouw geval)
Evaluatie.hasMany(Behaaldescore, { foreignKey: 'evaluatie_id', onDelete: 'CASCADE' });
Behaaldescore.belongsTo(Evaluatie, { foreignKey: 'evaluatie_id' });

// --- Behaaldescore & Rubriek / Competentie ---
// De ingevulde score linkt direct naar WELKE rubriek is gekozen, en voor WELKE competentie
Competentie.hasMany(Behaaldescore, { foreignKey: 'competentie_id', onDelete: 'NO ACTION' });
Behaaldescore.belongsTo(Competentie, { foreignKey: 'competentie_id' });

Rubriek.hasMany(Behaaldescore, { foreignKey: 'rubriek_id', onDelete: 'NO ACTION' });
Behaaldescore.belongsTo(Rubriek, { foreignKey: 'rubriek_id' });