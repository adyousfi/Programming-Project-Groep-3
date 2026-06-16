import StageDocument from "../objectModel/stageDocument.js";
import Stage from "../objectModel/stage.js";
import Student from "../userModel/student.js";
import User from "../userModel/user.js";
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

export const adminUploadDocument = async (req, res, next) => {
  try {
    const cookieUser = req.cookies.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const { stage_id } = req.body;
    if (!stage_id || !req.file) return res.status(400).json({ msg: 'stage_id en bestand zijn verplicht' });
    const doc = await StageDocument.create({
      stage_id: parseInt(stage_id),
      type: 'admin_template',
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      uploaded_by: cookieUser.user_id,
    });
    return res.status(201).json({ msg: 'Document geüpload', document_id: doc.document_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij uploaden' });
  }
};

export const studentUploadDocument = async (req, res, next) => {
  try {
    const cookieUser = req.cookies.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const student = await Student.findByPk(cookieUser.user_id);
    if (!student) return res.status(404).json({ msg: 'Geen student gevonden' });
    const stage = await Stage.findOne({
      where: {
        student_id: cookieUser.user_id,
        createdAt: { [Op.gte]: student.createdAt }
      },
      order: [['createdAt', 'DESC']]
    });
    if (!stage) return res.status(404).json({ msg: 'Geen stage gevonden' });
    if (!req.file) return res.status(400).json({ msg: 'Bestand is verplicht' });
    const doc = await StageDocument.create({
      stage_id: stage.stage_id,
      type: 'student_submission',
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      uploaded_by: cookieUser.user_id,
    });
    await stage.update({ status: 'DOCUMENTGEUPLOADED', document_validated: false });
    return res.status(201).json({ msg: 'Document ingediend', document_id: doc.document_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij uploaden' });
  }
};

export const getMyDocuments = async (req, res, next) => {
  try {
    const cookieUser = req.cookies.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const student = await Student.findByPk(cookieUser.user_id);
    if (!student) return res.json([]);
    const stage = await Stage.findOne({
      where: {
        student_id: cookieUser.user_id,
        createdAt: { [Op.gte]: student.createdAt }
      },
      order: [['createdAt', 'DESC']]
    });
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

export const getStageDocuments = async (req, res, next) => {
  try {
    const docs = await StageDocument.findAll({
      where: { stage_id: req.params.stageId },
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

export const downloadDocument = async (req, res, next) => {
  try {
    const doc = await StageDocument.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ msg: 'Document niet gevonden' });
    const filePath = path.join(uploadsDir, doc.stored_name);
    if (!fs.existsSync(filePath)) return res.status(404).json({ msg: 'Bestand niet gevonden op server' });
    res.setHeader('Content-Disposition', `attachment; filename="${doc.original_name}"`);
    return res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij downloaden' });
  }
};

export default { adminUploadDocument, studentUploadDocument, getMyDocuments, getStageDocuments, downloadDocument };
