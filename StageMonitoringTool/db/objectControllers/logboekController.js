import Logboek from "../objectModel/logboek.js";
import { sequelize } from "../dbConnection.js";
import { where } from "sequelize";

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

const assignOpmerkingToLogboek = async (req,res,next) =>{
    const{
        stage_id,
        opmerkinglogboek_id
    } = req.body;

    try{
        const ulogboek = await Logboek.update(
        {
             opmerkinglogboek_id: opmerkinglogboek_id,
        },
        {
            where:{ stage_id: stage_id}
        }          
            
        )
        return res.status(200).json({
            msg: "Logboek updated successfully",
            data: ulogboek
        })
    }
    catch(error){
        console.error("Error updating logboek: ", error); 
        return res.status(500).json({
            msg: "something went wrong while updating logboek"
        });
    }

}

export default {createLogboek,assignOpmerkingToLogboek};