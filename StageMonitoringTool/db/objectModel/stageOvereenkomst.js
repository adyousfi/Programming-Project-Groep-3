import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";

const Stageovereenkomst = sequelize.define("Stageovereenkomst",{
    stageovereenkomst_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    
})