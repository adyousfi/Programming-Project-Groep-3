import Competentie from "../objectModel/competentie.js";
import { sequelize } from "../dbConnection.js";

const createCompetentie  = async(req,res,next) =>{
    const{
        code,
        title,
        omschrijving,
        gewicht
    } = req.body
    try{
        const competentie = await Competentie.create({
            code:code,
            title:title,
            omschrijving:omschrijving,
            gewicht:gewicht
        })

        return res.status(200).json({
            msg: "Competentie created successfully",
            data: competentie
        })
    }
    catch(error){
        console.error("Error creating competentie: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating competentie"
        });
    }

}

export default {createCompetentie};