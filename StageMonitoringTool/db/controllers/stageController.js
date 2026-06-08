import stage from "../stage/stage.js";
import { sequelize } from "../dbConnection.js";
import Stage from "../stage/stage.js";

const createStage = async (omschrijving_opdracht, status, begin_datum, eind_datum) =>{
    
    const stage = await Stage.create({
        omschrijving_opdracht: omschrijving_opdracht,
        status: status,
        begin_datum: begin_datum,
        eind_datum: eind_datum
    })

    console.log(stage);
}

export default createStage;