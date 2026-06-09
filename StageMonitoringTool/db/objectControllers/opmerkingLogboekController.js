import Opmerkinglogboek from "../objectModel/opmerkingLogboek.js";
import { sequelize } from "../dbConnection.js";

const createOpmerkinglogboek = async(req,res,next) =>{
    const{
        stage_id,
        opmerking
    } = req.body;
    try{
        const opmerkingLogboek = await Opmerkinglogboek.create({
            stage_id:stage_id,
            opmerking:opmerking
        })
        return res.status(200).json({
            msg: "Opmerkinglogboek created successfully",
            data: opmerkingLogboek
        })
    }
    catch(error){
        console.error("Error creating opmerkingLogboek: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating opmerkingLogboek"
        });
    }
}

export default {createOpmerkinglogboek};