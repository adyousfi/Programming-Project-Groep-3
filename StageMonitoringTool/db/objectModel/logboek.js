import { sequelize } from "../dbConnection.js";
import { DataTypes, Deferrable } from "sequelize";

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

export default Logboek;