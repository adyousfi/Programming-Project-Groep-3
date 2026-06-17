import { sequelize } from "../dbConnection.js";
import { DataTypes } from "sequelize";

const Evaluatie = sequelize.define("Evaluatie", {
    evaluatie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    type_evaluatie: {
        type: DataTypes.ENUM('tussentijds', 'finale'),
        allowNull: false,
    },

    // Score van docent
    score_docent: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    // Docentfeedback (tussentijds/finale)
    feedback_docent: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    // Score van student (wie bv. zichzelf of door stagecommisie wordt ingegeven)
    score_student: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    feedback_student: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    // Score van mentor
    score_mentor: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    feedback_mentor: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    stage_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    docent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },


    competentie_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    rubriek_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    datum_evaluatie: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

export default Evaluatie;
