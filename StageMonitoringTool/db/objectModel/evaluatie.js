import { sequelize } from "../dbConnection.js";
import { DataTypes,Deferrable } from "sequelize";

const Evaluatie = sequelize.define("Evaluatie", {
    evaluatie_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    competentie_id:{
        type: DataTypes.INTEGER
    },
    

})