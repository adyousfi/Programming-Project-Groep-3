import { sequelize } from "../dbConnection.js";
import { DataTypes } from "sequelize";

const BehaaldeScore = sequelize.define("BehaaldeScore", {
    score_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }
    // evaluatie_id, competentie_id en rubriek_id komen hier via relaties
});

export default BehaaldeScore;