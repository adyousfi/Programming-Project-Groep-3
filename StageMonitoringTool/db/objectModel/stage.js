
import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";
import Docent from "../userModel/docent.js";
import Student from "../userModel/student.js";
import Admin from "../userModel/admin.js";
import Stagementor from "../userModel/stagementor.js";
import Bedrijf from "./bedrijf.js";


export const status = {
    AANVRAAG: 'Aanvraag',
    GOEDGEKEURD: 'Goedgekeurd',
    AANPASSINGENVEREISD: 'Aanpassingen_vereist',
    AFGEKEURD: 'Afgekeurd',
    DOCUMENTGEUPLOADED: 'documentgeuploaded',
    KLAAR: 'klaar'
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
        comment: "FK - Reference to stageaanvraag"
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
        comment: "FK - Reference to admin"
    },
    mentor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    bedrijfs_id: {
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
        defaultValue: 'Aanvraag'
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
        comment: "Feedback from stagecommissie"
    },
    document_validated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "True when admin has validated the student's submitted document"
    },
    },
    {
        timestamps: true,
    }

)



// Define associations
Stage.belongsTo(Docent, { foreignKey: 'docent_id', as: 'docent' });
Stage.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Stage.belongsTo(Admin, { foreignKey: 'admin_id', as: 'admin' });
Stage.belongsTo(Stagementor, { foreignKey: 'mentor_id', as: 'mentor' });
Stage.belongsTo(Bedrijf, { foreignKey: 'bedrijfs_id', as: 'bedrijf' });

export default Stage;
