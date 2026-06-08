import { sequelize } from "../dbConnection";
import { DataTypes } from "sequelize";

export const status = {
    //Status van logboek?
};

const Bedrijf = sequelize.define("Bedrijf", {

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
    date:{
        type: DataTypes.DATE,
    },
    leerpunten:{
        type: DataTypes.STRING
    },
    chechmark:{
        type: DataTypes.BOOLEAN,
    },
    reflectie:{
        type: DataTypes.STRING
    },
    status:{
        type: DataTypes.ENUM(Object.values(status)),
        allowNull:false
    }


    },
    {
        timestamps: true,
    }
)

export default Bedrijf;