import { sequelize } from "../dbConnection.js";
import { DataTypes,Deferrable } from "sequelize";

const Rubriek = sequelize.define("Rubriek",{
    rubriek_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    competentie_id:{
        type: DataTypes.INTEGER
    },
    rubriektitel:{
        type:DataTypes.STRING
    },
    rubriek_beschrijving:{
        type: DataTypes.STRING
    }

})

export default Rubriek;