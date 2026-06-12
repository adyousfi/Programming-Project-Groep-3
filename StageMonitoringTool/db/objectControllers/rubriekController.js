import Rubriek from "../objectModel/rubriek.js";
import { sequelize } from "../dbConnection.js";

const createRubriek = async (req,res,next) =>{
    const{
        competentie_id,
        rubriektitel,
        rubriek_beschrijving
    } = req.body

    try{
        const rubriek = await Rubriek.create({
            competentie_id: competentie_id,
            rubriektitel: rubriektitel,
            rubriek_beschrijving: rubriek_beschrijving
        })
        return res.status(200).json({
            msg: "Rubriek created successfully",
            data: rubriek
        })
    }
    catch(error){
        console.error("Error creating rubriek: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating rubriek"
        });
    }

}

export default {createRubriek};