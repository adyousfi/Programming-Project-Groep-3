
import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";
import Docent from "../userModel/docent.js";
import Student from "../userModel/student.js";
import Admin from "../userModel/admin.js";
import Stagementor from "../userModel/stagementor.js";
import Bedrijf from "./bedrijf.js";

export const status = {
    AANVRAAG: 'AANVRAAG',
    GOEDGEKEURD: 'GOEDGEKEURD',
    AANPASSINGENVEREISD: 'AANPASSINGENVEREISD',
    DOCUMENTGEUPLOADED: 'DOCUMENTGEUPLOADED',
    KLAAR: 'KLAAR'
};

// Stage model
const Stage = sequelize.define("Stage", {
    stage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    docent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    stagementor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    bedrijf_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    omschrijving_opdracht: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM(Object.values(status)),
        allowNull: true,
        defaultValue: 'AANVRAAG',
        values: ['AANVRAAG','GOEDGEKEURD','AANPASSINGENVEREISD','DOCUMENTGEUPLOADED','KLAAR']
    },
    begin_datum: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    eind_datum: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    },
    {
        timestamps: true,
    }

)

// Define associations
// Define associations
Stage.belongsTo(Docent, { foreignKey: 'docent_id', onDelete: 'NO ACTION' });
Stage.belongsTo(Student, { foreignKey: 'student_id', onDelete: 'NO ACTION' });
Stage.belongsTo(Bedrijf, { foreignKey: 'bedrijf_id', onDelete: 'NO ACTION' });
Stage.belongsTo(Stagementor, { foreignKey: 'stagementor_id', onDelete: 'NO ACTION' });

const linkStagementorToBedrijf = async (userId, bedrijfId) =>{
    await Stagementor.update(
    { bedrijf_id: bedrijfId }, 
    { where: { user_id: userId } }
);
}


export default Stage;