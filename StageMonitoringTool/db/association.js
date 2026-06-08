import User from "./userModel/user.js";
import Student from "./userModel/student.js";
import Stagecommisie from "./userModel/stagecommisie.js";
import Stagementor from "./userModel/stagementor.js";
import Docent from "./userModel/docent.js";
import Bedrijf from "./objectModel/bedrijf.js";

export const initAssociation = () => {
    //StageMentor
    User.hasOne(Stagementor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Stagementor.belongsTo(User, { foreignKey: 'user_id' });

    //Student
    User.hasOne(Student, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Student.belongsTo(User, {foreignKey: 'user_id'});

    //Docent
    User.hasOne(Docent, {foreignKey: 'user_id',onDelete: 'CASCADE'});
    Docent.belongsTo(User, {foreignKey: 'user_id'});

    //StageCommisie
    User.hasOne(Stagecommisie, {foreignKey: 'user_id', onDelete: 'CASCADE'});
    Stagecommisie.belongsTo(User,{foreignKey: 'user_id'});

    //Bedrijf
    Bedrijf.hasMany(Stagementor, { foreignKey: 'bedrijf_id', onDelete: 'CASCADE' });
    Stagementor.belongsTo(Bedrijf, { foreignKey: 'bedrijf_id' });
    


}