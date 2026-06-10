import Opmerkinglogboek from "../objectModel/opmerkingLogboek.js";
import { sequelize } from "../dbConnection.js";
import Logboek from "../objectModel/logboek.js";

const createOpmerkinglogboek = async(req,res,next) =>{
    const{
        logboek_id,
        opmerking
    } = req.body;
    try
    {
        const opmerkingLogboek = await Opmerkinglogboek.create({
            opmerking:opmerking
        })
        await Logboek.update(
            {
                opmerkinglogboek_id: opmerkingLogboek.opmerkinglogboek_id
            },
            {
                where:{logboek_id: logboek_id}
            });
        return res.status(200).json({
            msg: "Opmerkinglogboek created and binded successfully",
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