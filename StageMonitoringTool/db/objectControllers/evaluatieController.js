import Evaluatie from "../objectModel/evaluatie.js";

const createEvaluatie = async (req, res, next) => {
    const {
        type_evaluatie,
        feedback_docent,
        feedback_student,
        feedback_mentor,
        stage_id
    } = req.body;

    try {
        // We use 'nieuweEvaluatie' to avoid naming conflicts with req.body variables
        const nieuweEvaluatie = await Evaluatie.create({
            type_evaluatie: type_evaluatie,
            feedback_docent: feedback_docent,
            feedback_student: feedback_student,
            feedback_mentor: feedback_mentor,
            stage_id: stage_id
        });

        return res.status(200).json({
            msg: "Evaluatie created successfully",
            data: nieuweEvaluatie
        });

    } catch (error) {
        console.error("Error creating evaluatie: ", error);
        return res.status(500).json({
            msg: "Something went wrong while creating evaluatie"
        });
    }
};

export default { createEvaluatie };