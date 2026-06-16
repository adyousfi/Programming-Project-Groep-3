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
        type: DataTypes.ENUM('tussentijds', 'finaal'),
        allowNull: false
    },
    feedback_docent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    feedback_student: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    feedback_mentor: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    // stage_id komt hier via de relaties in dbConnection.js
});

export default Evaluatie;