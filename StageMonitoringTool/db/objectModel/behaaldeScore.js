//SOCRE ID SCORE STAGEAANVRAAG ID Type
import { defaultValueSchemable } from "sequelize/lib/utils";
import { sequelize } from "../dbConnection.js"
import { DataTypes,Deferrable } from "sequelize"

export const TYPE = {
    FINAAL: "FINAAL",
    TUSSENTIJDS: "TUSSENTIJDS"
};

const Behaaldescore = sequelize.define("Behaaldescore",{
    behaadlescore_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    stage_id:{
        type:DataTypes.INTEGER
    },
    score:{
        type:DataTypes.INTEGER
    },
    type:{
        type: DataTypes.ENUM,
        defaultValue:"TUSSENTIJDS",
        values: ["FINAAL","TUSSENTIJDS"]
    }

})

export default Behaaldescore;