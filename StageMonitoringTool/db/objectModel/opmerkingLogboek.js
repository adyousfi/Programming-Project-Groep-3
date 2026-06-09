import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";

const Opmerkinglogboek = sequelize.define("OpmerkingLogboek",{
    opmerkinglogboek_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    stage_id:{
        type: DataTypes.INTEGER,
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