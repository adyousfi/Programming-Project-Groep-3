import Student from "../userModel/student.js";
import { sequelize } from "../dbConnection.js";

const createStudent = async (user_id) =>
{
    
    const student = await Student.create(
	{
		user_id: user_id
	})
	console.log(student)
  
}

//STUDENT UPLOAD DOCUMENT
const uploadDocument = async (req, res, next) => {
	try {
    const cookieUser = req.cookies.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const stage = await Stage.findOne({ where: { student_id: cookieUser.user_id }, order: [['createdAt', 'DESC']] });
    if (!stage) return res.status(404).json({ msg: 'Geen stage gevonden' });
    if (!req.file) return res.status(400).json({ msg: 'Bestand is verplicht' });
    const doc = await StageDocument.create({
      stage_id: stage.stage_id,
      type: 'student_submission',
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      uploaded_by: cookieUser.user_id,
    });
    return res.status(201).json({ msg: 'Document ingediend', document_id: doc.document_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij uploaden' });
  }
};

//GET STUDENT DOCUMENTS
const getStudentDocuments = async (req, res, next) => {
	try {
    const cookieUser = req.cookies.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const stage = await Stage.findOne({ where: { student_id: cookieUser.user_id }, order: [['createdAt', 'DESC']] });
    if (!stage) return res.json([]);
    const docs = await StageDocument.findAll({
      where: { stage_id: stage.stage_id },
      order: [['createdAt', 'DESC']],
    });
    return res.json(docs.map(d => ({
      id: d.document_id,
      type: d.type,
      name: d.original_name,
      datum: new Date(d.createdAt).toLocaleDateString('nl-BE'),
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij ophalen documenten' });
  }
};

export default { createStudent, uploadDocument, getStudentDocuments };