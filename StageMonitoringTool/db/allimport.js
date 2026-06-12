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
//Logboek & Opmerking Relaties
Opmerkinglogboek.hasMany(Logboek, { foreignKey: 'opmerkinglogboek_id', onDelete: 'CASCADE' });
Logboek.belongsTo(Opmerkinglogboek, { foreignKey: 'opmerkinglogboek_id', onDelete: 'CASCADE'});

//behaaldescore
Behaaldescore.belongsTo(Stage, { foreignKey: 'stage_id',onDelete: 'CASCADE'});
export const confirmRelations = "relations are made";
