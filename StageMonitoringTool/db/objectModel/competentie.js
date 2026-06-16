import { sequelize } from "../dbConnection.js";
import { DataTypes } from "sequelize";

const Competentie = sequelize.define("Competentie", {
    competentie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING, // Bijv: "C1"
        allowNull: false
    },
    titel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    omschrijving: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    gewicht_percentage: {
        type: DataTypes.INTEGER, // Bijv: 10 voor 10%
        allowNull: false
    }
});

export default Competentie;