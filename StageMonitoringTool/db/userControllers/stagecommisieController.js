import { sequelize } from "../dbConnection.js";
import Stagecommisie from "../userModel/stagecommisie.js";

const createStagecommisie = async (stagecommisie_id, user_id) => {
    const stagecommisie = await Stagecommisie.create({
        stagecommisie_id: stagecommisie_id,
        user_id: user_id
    });
    console.log(stagecommisie);
};

export default createStagecommisie;
