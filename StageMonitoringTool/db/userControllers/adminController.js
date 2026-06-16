import Admin from "../userModel/admin.js";
import { sequelize } from "../dbConnection.js";
import Stage from "../objectModel/stage.js";
import StageDocument from "../objectModel/stageDocument.js";

const createAdmin = async (admin_id, user_id) => {
    const admin = await Admin.create({
        admin_id: admin_id,
        user_id: user_id
    });
    console.log(admin);
};

const validateStudentDocument = async (req, res, next) => {
    try {
        const cookieUser = req.cookies.user;
        if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

        const stage = await Stage.findByPk(req.params.id);
        if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });

        await stage.update({ document_validated: true });
        return res.json({ msg: 'Document succesvol gevalideerd', document_validated: true });
    } catch (error) {
        console.error('Error validating document:', error);
        return res.status(500).json({ msg: 'Fout bij valideren van document' });
    }
};

export default { createAdmin, validateStudentDocument };
