import Behaaldescore from "../objectModel/behaaldeScore.js"
import { sequelize } from "../dbConnection.js"

const createBehaaldescore = async(req,res,next) =>{

    const {
        stage_id,
        score,
        type
    } = req.body;

    try{
        
        const behaaldescore = await Behaaldescore.create({
            stage_id: stage_id,
            score: score,
            type: type
        })

        return res.status(200).json({
            msg: "behaaldeScore created successfully",
            data: behaaldescore
        })
    }
    catch(error){
        console.error("Error creating behaaldeScore: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating behaaldeScore"
        });
    }
}

export default {createBehaaldescore};