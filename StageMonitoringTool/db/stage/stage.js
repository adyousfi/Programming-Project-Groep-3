import sequelize from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";

export const status = {
    Aangevraagt: 'Aanvraag',
    Goedgekeurd: 'Goedgekeurd',
    Aanpassingen_vereist: 'Aanpassingen_vereist',
    Documentgeupload: 'documentgeupload',
    Klaar: 'klaar'
};

// Stage model
const stage = sequelize.define("stage", {
    stage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "PK - Stage primary key"
    },
    stageaanvraag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "FK - Reference to stageaanvraag"
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "FK - Reference to student (admin)"
    },
    docent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "FK - Reference to docent (admin)"
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "FK - Reference to admin"
    },
    mentor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "FK - Reference to mentor"
    },
    bedrijfs_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "FK - Reference to bedrijf"
    },
    omschrijving_opdracht: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(Object.values(status)),
        allowNull: false,
        defaultValue: 'Aanvraag'
    },
    begin_datum: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    eind_datum: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    },
    {
        timestamps: true,
    }

)

// Import other models for associations
import docent from "../userModel/userSub/docent.js";
import student from "../userModel/userSub/student.js";
import admin from "../userModel/userSub/admin.js";
import mentor from "../userModel/userSub/stagementor.js";

// Define associations
stage.belongsTo(docent, { foreignKey: 'docent_id', as: 'docent' });
stage.belongsTo(student, { foreignKey: 'student_id', as: 'student' });
stage.belongsTo(admin, { foreignKey: 'admin_id', as: 'admin' });
stage.belongsTo(mentor, { foreignKey: 'mentor_id', as: 'mentor' });

export default stage;
