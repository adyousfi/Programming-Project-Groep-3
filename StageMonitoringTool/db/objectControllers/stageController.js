import Stage from "../objectModel/stage.js";
import Stagementor from "../userModel/stagementor.js";
import { sequelize } from "../dbConnection.js";

const createStage = async (req,res,next) =>{

    const {
        student_id,
        docent_id,
        stagementor_id,
        bedrijf_id,
        omschrijving_opdracht,
        status,
        begin_datum,
        eind_datum
    } = req.body;
        
    try{
        const stage = await Stage.create({
            student_id: student_id,
            docent_id: docent_id,
            stagementor_id: stagementor_id,
            bedrijf_id: bedrijf_id,
            omschrijving_opdracht: omschrijving_opdracht,
            status: status,
            begin_datum: begin_datum,
            eind_datum: eind_datum
        });
        return res.status(200).json({
            msg: "Stage created successfully",
            data: stage
        })
    }
    catch(error){
        console.error("Error creating stage: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating stage"
        });
    }
};

const updateStage = async (req, res, next) => {
    try {
            
    const {
        stage_id,
        student_id,
        docent_id,
        stagementor_id,
        bedrijf_id
    } = req.body;
    
    await Stage.update(
    { 
        student_id: student_id,
        docent_id: docent_id,
        stagementor_id: stagementor_id,
        bedrijf_id: bedrijf_id
    },
    {where: { stage_id: stage_id }});
    }
    catch(error){
        console.error("Error updating stage: ", error); 
        return res.status(500).json({
            msg: "something went wrong while updating stage"
        });
    }
}; 

export default { createStage, updateStage };

