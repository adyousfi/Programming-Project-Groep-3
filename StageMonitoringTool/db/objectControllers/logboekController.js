import Logboek from "../objectModel/logboek.js";
import { sequelize } from "../dbConnection.js";

const createLogboek = async (req, res, next) =>{
    const{
        stage_id,
        uitgevoerdeTaken,
        datum,
        leerpunten,
        checkmark,
        reflectie,
        status
    } = req.body;
    try{
        const logboek = await Logboek.create({
            stage_id:stage_id,
            uitgevoerdeTaken:uitgevoerdeTaken,
            datum:datum,
            leerpunten:leerpunten,
            checkmark:checkmark,
            reflectie:reflectie,
            status:status
        })
        return res.status(200).json({
            msg: "Logboek created successfully",
            data: logboek
        })
    }
    catch(error){
        console.error("Error creating logboek: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating logboek"
        });
    }
}

export default {createLogboek};