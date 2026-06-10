import { sequelize } from "sequelize";
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

//RELATIONS

//Users
User.hasOne(Admin, {foreignKey: 'admin_id',onDelete: 'CASCADE'});
User.hasOne(Docent, {foreignKey: 'docent_id',onDelete: 'CASCADE'});
User.hasOne(Stagecommisie, {foreignKey: 'stagecommisie_id',onDelete: 'CASCADE'});
User.hasOne(Stagementor, {foreignKey: 'bedrijf_id',onDelete: 'CASCADE'});
User.hasOne(Student, {foreignKey: 'user_id',onDelete: 'CASCADE'});

//Studenten
Student.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

//Docenten
Docent.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

//Stagementors
Stagementor.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

//Stagecommisie
Stagecommisie.belongsTo(User, {foreignKey: 'user_id'});

//Admins
Admin.belongsTo(User, {foreignKey: 'user_id'});

//Bedrijf & Mentor
Stagementor.belongsTo(Bedrijf, { foreignKey: 'bedrijf_id', onDelete: 'CASCADE' });

//Bedrijf
Bedrijf.hasMany(Stagementor, { foreignKey: 'bedrijf_id',onDelete: 'CASCADE'});

//Stage Relaties
Stage.belongsTo(Docent, { foreignKey: 'docent_id', onDelete: 'NO ACTION' });
Stage.belongsTo(Student, { foreignKey: 'student_id', onDelete: 'NO ACTION' });
Stage.belongsTo(Bedrijf, { foreignKey: 'bedrijf_id', onDelete: 'NO ACTION' });
Stage.belongsTo(Stagementor, { foreignKey: 'stagementor_id', onDelete: 'NO ACTION' });

//Logboek & Opmerking Relaties
Opmerkinglogboek.hasMany(Logboek, { foreignKey: 'opmerkinglogboek_id' });
Logboek.belongsTo(Opmerkinglogboek, { foreignKey: 'opmerkinglogboek_id', onDelete: 'SET NULL'});