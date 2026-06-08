import Stage from "../objectModel/stage.js";
import Stagementor from "../userModel/stagementor.js";

const createStage = async (omschrijving_opdracht,begin_datum,eind_datum) =>{

    const bedrijf = await Bedrijf.create({
        omschrijving_opdracht: omschrijving_opdracht,
        begin_datum: begin_datum,
        eind_datum: eind_datum
    })

    console.log(bedrijf);
        
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
export {createStage, linkStageToMoreUser};