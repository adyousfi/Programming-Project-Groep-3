import { sequelize } from "../dbConnection.js";
import { DataTypes } from "sequelize";

const Rubriek = sequelize.define("Rubriek", {
    rubriek_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    score: {
        type: DataTypes.INTEGER, // Bijv: 1 tot 5
        allowNull: false
    },
    beschrijving: {
        type: DataTypes.TEXT,
        allowNull: false
    }
    // competentie_id komt hier via relaties
});

export default Rubriek;