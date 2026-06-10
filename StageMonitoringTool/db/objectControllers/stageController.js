import Stage from "../objectModel/stage.js";
import Stagementor from "../userModel/stagementor.js";
import { sequelize } from "../dbConnection.js";

const createStageCore = async (omschrijving_opdracht, status, begin_datum, eind_datum) => {
    const stage = await Stage.create({
        omschrijving_opdracht,
        status,
        begin_datum,
        eind_datum
    });
    return stage;
};

const createStage = async (req, res, next) => {
    const { omschrijving_opdracht, status, begin_datum, eind_datum } = req.body;

    try {
        const stage = await createStageCore(omschrijving_opdracht, status, begin_datum, eind_datum);
        return res.status(200).json({
            msg: "Stage created successfully",
            data: stage
        });
    } catch (error) {
        console.error("Error creating stage: ", error);
        return res.status(500).json({
            msg: "something went wrong while creating stage"
        });
    }
};

const updateStage = async (req, res, next) => {
    try {
        const { stage_id, student_id, docent_id, mentor_id, bedrijf_id } = req.body;

        await Stage.update(
            { student_id, docent_id, mentor_id, bedrijf_id },
            { where: { stage_id } }
        );

        return res.status(200).json({ msg: "Stage updated successfully" });
    } catch (error) {
        console.error("Error updating stage: ", error);
        return res.status(500).json({ msg: "something went wrong while updating stage" });
    }
};

export { createStageCore, createStage, updateStage };




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