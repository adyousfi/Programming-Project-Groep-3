import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";
import logboekController from "../objectControllers/logboekController.js";

const Opmerkinglogboek = sequelize.define("OpmerkingLogboek",{
    opmerkinglogboek_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    opmerking:{
        type: DataTypes.STRING
    }
    },
    {
        timestamps: true,
    }

)

export default Opmerkinglogboek;