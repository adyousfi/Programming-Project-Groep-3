import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";
import Opmerkinglogboek from "./opmerkingLogboek.js";

export const status = {
    NIETINGEVULD: "NIETINGEVULD",
    DEELSINGEVULD: "DEELSINGEVULD",
    INGEVULD: "INGEVULD"
};

const Logboek = sequelize.define("Logboek", {

    logboek_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    stage_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    opmerkinglogboek_id:{
        type:DataTypes.INTEGER,
        allowNull:true
    },

    uitgevoerdeTaken:{
        type:DataTypes.STRING,
    },
    datum:{
        type: DataTypes.DATE,
    },
    leerpunten:{
        type: DataTypes.STRING
    },
    checkmark:{
        type: DataTypes.BOOLEAN,
    },
    reflectie:{
        type: DataTypes.STRING
    },
    gevinkt_door_student:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false,
    },
    status:{
        type: DataTypes.ENUM(Object.values(status)),
        allowNull:false,
        defaultValue: "NIETINGEVULD",
        values: ["NIETINGEVULD","DEELSINGEVULD","INGEVULD"]
    }


    },
    {
        timestamps: true,
    }
)

Logboek.belongsTo(Opmerkinglogboek, { foreignKey: 'opmerkinglogboek_id', onDelete: 'SET NULL'});

export default Logboek;