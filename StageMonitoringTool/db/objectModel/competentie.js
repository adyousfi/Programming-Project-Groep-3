import { sequelize } from "../dbConnection.js";
import { DataTypes,Deferrable } from "sequelize";

const Competentie = sequelize.define("Competentie",{
    competentie_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    code:{
        type:DataTypes.STRING
    },
    title:{
        type:DataTypes.STRING
    },
    omschrijving:{
        type:DataTypes.STRING
    },
    gewicht:{
        type:DataTypes.STRING
    },
})

export default Competentie;