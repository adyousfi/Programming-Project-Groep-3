
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
    AFGEKEURD: 'AFGEKEURD',
    DOCUMENTGEUPLOADED: 'DOCUMENTGEUPLOADED',
    KLAAR: 'KLAAR'
};

// Stage model
const Stage = sequelize.define("stage", {
    stage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    stageaanvraag_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    docent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    admin_id: {
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
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM(Object.values(status)),
        allowNull: true,
        defaultValue: 'AANVRAAG',
        values: Object.values(status)
    },
    begin_datum: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    eind_datum: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    document_validated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    },
    {
        timestamps: true,
    }

)

const linkStagementorToBedrijf = async (userId, bedrijfId) =>{
    await Stagementor.update(
    { bedrijf_id: bedrijfId }, 
    { where: { user_id: userId } }
);
}


export default Stage;
