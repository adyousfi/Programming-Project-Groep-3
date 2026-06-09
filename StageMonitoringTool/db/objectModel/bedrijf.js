import { DataTypes } from "sequelize";
import { sequelize } from "../dbConnection.js";
import Stagementor from "../userModel/stagementor.js";

const Bedrijf = sequelize.define("Bedrijf", {

    bedrijf_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },

    naam:{
        type: DataTypes.STRING,
        allowNull: false,
    },

    address:{
        type:DataTypes.STRING,
        allowNull:true,
    },

    },
    {
        timestamps: true,
    }
)

export default Bedrijf;