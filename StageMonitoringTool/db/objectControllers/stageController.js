import Stage from "../objectModel/stage.js";
import Stagementor from "../userModel/stagementor.js";
import { sequelize } from "../dbConnection.js";

const createStage = async (req,res,next) =>{

    const {
        omschrijving_opdracht,
        status,
        begin_datum,
        eind_datum
    } = req.body;
        
    try{
        const user = await Stage.create({
            omschrijving_opdracht: omschrijving_opdracht,
            status: status,
            begin_datum: begin_datum,
            eind_datum: eind_datum
        });
        return res.status(200).json({
            msg: "Stage created successfully",
            data: Stage
        })
    }
    catch(error){
        console.error("Error creating stage: ", error); 
        return res.status(500).json({
            msg: "something went wrong while creating stage"
        });

    }
}

const linkStageToMoreUser = async (stageId,studentId,docentId,mentorId,bedrijfId,) =>{
    await Stage.update(
    { 
        student_id: studentId,
        docent_id: docentId,
        mentor_id: mentorId,
        bedrijf_id: bedrijfId
    },
    {where: { stage_id: stageId }}
);
}
export default {createStage, linkStageToMoreUser};









// const createStage = async (req, res, next) => {
//     const {
//         omschrijving_opdracht,
//         begin_datum,
//         eind_datum
//     } = req.body;

//     try {

//         const user = await User.create({
//             omschrijving_opdracht: omschrijving_opdracht,
//             begin_datum: begin_datum,
//             eind_datum: eind_datum,
//         });

        

//         return res.status(200).json({
//             msg: "Stage created successfully",
//             data: stage
//         });

//     } catch (error) {
//         console.error("Error creating user: ", error); 
//         return res.status(500).json({
//             msg: "something went wrong while creating user"
//         });
//     }
// };