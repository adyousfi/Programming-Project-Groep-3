import Stage from "../objectModel/stage.js";
import Stagementor from "../userModel/stagementor.js";
import { sequelize } from "../dbConnection.js";
import Student from "../userModel/student.js";
import User from "../userModel/user.js";
import Bedrijf from "../objectModel/bedrijf.js";
import Docent from "../userModel/docent.js";

const createStage = async (req,res,next) => {

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
    
    return res.status(200).json({
        msg: "Stage updated successfully"
    });
    }
    catch(error){
        console.error("Error updating stage: ", error); 
        return res.status(500).json({
            msg: "something went wrong while updating stage"
        });
    }
}; 

const selectStage = async (req, res, next) => {
    try {
        const stage = await Stage.findAll({
            include: [
                {
                    model: Student,
                    as: 'student',
                    include: [{ model: User, as: 'User' }]
                },
                {
                    model: Bedrijf,
                    as: 'bedrijf'
                },
                {
                    model: Docent,
                    as: 'docent',
                    include: [{ model: User, as: 'User' }]
                }
            ]
        });
        return res.status(200).json({
            msg: "Stage selected successfully",
            data: stage
        });
    }
    catch(error){
        console.error("Error selecting stage: ", error); 
        return res.status(500).json({
            msg: "something went wrong while selecting stage"
        });
    }
}; 

export default { createStage, updateStage, selectStage };
