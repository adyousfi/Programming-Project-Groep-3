import { sequelize } from "../dbConnection.js";
import { DataTypes } from "sequelize";

const Rubriek = sequelize.define("Rubriek", {
    rubriek_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    competentie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    code: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    volgnummer: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    score: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    beschrijving: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

export default Rubriek;

