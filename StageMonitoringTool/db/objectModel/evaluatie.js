import { sequelize } from "../dbConnection.js";
import { DataTypes,Deferrable } from "sequelize";

export const TYPE = {
    FINAAL: "FINAAL",
    TUSSENTIJDS: "TUSSENTIJDS"
};


const Evaluatie = sequelize.define("Evaluatie", {
    evaluatie_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    //TT stands for TussenTabel
    competentie_TT:{
        type: DataTypes.INTEGER
    },
    type:{
        type: DataTypes.ENUM,
        defaultValue:"TUSSENTIJDS",
        values: ["FINAAL","TUSSENTIJDS"]
    },
    feedback_docent:{
        type: DataTypes.STRING,
    },
    feedback_student:{
        type: DataTypes.STRING,
    },
    feedback_mentor:{
        type: DataTypes.STRING
    }
    

})