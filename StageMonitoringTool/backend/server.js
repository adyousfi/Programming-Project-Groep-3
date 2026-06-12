import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/user.js';
import Student from '../db/userModel/student.js';
import Stagementor from '../db/userModel/stagementor.js';
import Bedrijf from '../db/objectModel/bedrijf.js';
import Stage from '../db/objectModel/stage.js';
import Docent from '../db/userModel/docent.js';
import StageDocument from '../db/objectModel/stageDocument.js';
import {sequelize} from '../db/dbConnection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5500'
    ];
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

await run();

// ✅ LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.password !== password) {
      return res.json({ success: false, message: 'Foute login' });
    }
    res.cookie('user', {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    }, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax'
    });
    res.json({
      success: true,
      message: 'Login succesvol',
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ✅ CHECK login
app.get('/me', async (req, res) => {
  if (req.cookies.user) {
    const cookie = req.cookies.user;
    if (!cookie.last_name && cookie.user_id) {
      const fullUser = await User.findByPk(cookie.user_id);
      if (fullUser) {
        cookie.last_name = fullUser.last_name;
        cookie.first_name = fullUser.first_name;
        res.cookie('user', cookie, { httpOnly: true, maxAge: 1000 * 60 * 60, sameSite: 'lax' });
      }
    }
    res.json({ loggedIn: true, user: cookie });
  } else {
    res.json({ loggedIn: false });
  }
});

// ✅ LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.cookie('user', '', { maxAge: 0, httpOnly: true, sameSite: 'lax' });
  res.json({ success: true });
});

// ✅ GET alle stages
app.get('/api/stages', async (req, res) => {
  try {
    const stages = await Stage.findAll({
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
        { model: Stagementor, as: 'mentor', include: [{ model: User, as: 'User' }] },
        { model: Bedrijf, as: 'bedrijf' },
        { model: Docent, as: 'docent', include: [{ model: User, as: 'User' }] },
      ]
    });

    const result = stages.map(s => {
      const studentUser = s.student ? s.student.User : null;
      const mentorUser = s.mentor ? s.mentor.User : null;
      const docentUser = s.docent ? s.docent.User : null;

      return {
        id: s.stage_id,
        naam: studentUser ? `${studentUser.first_name} ${studentUser.last_name}` : '',
        studentEmail: studentUser ? studentUser.email : '',
        functie: '',
        bedrijf: {
          naam: s.bedrijf ? s.bedrijf.naam : '',
          adres: s.bedrijf ? s.bedrijf.address : '',
          contactpersoon: '',
          email: '',
          telefoon: '',
        },
        stagementor: {
          naam: mentorUser ? `${mentorUser.first_name} ${mentorUser.last_name}` : '',
          email: mentorUser ? mentorUser.email : '',
          telefoon: mentorUser ? mentorUser.phone : '',
        },
        docent: {
          naam: docentUser ? `${docentUser.first_name} ${docentUser.last_name}` : '',
          email: docentUser ? docentUser.email : '',
          user_id: s.docent_id || null,
        },
        stageDetails: {
          omschrijving: s.omschrijving_opdracht || '',
          start: s.begin_datum || '',
          einde: s.eind_datum || '',
          urenPerWeek: '',
        },
        status: s.status === 'Aanvraag' ? 'in_afwachting'
          : s.status === 'Goedgekeurd' ? 'goedgekeurd'
          : s.status === 'Afgekeurd' ? 'afgekeurd'
          : s.status === 'Aanpassingen_vereist' ? 'aanpassingen'
          : s.status,
        datum: s.createdAt ? new Date(s.createdAt).toLocaleDateString('nl-BE') : '',
        historiek: null,
      };
    });

    return res.json(result);
  } catch (error) {
    console.error('Error fetching stages:', error);
    return res.status(500).json({ msg: 'Fout bij ophalen van stages' });
  }
});

// ✅ POST nieuwe stage aanmaken
app.post('/api/stages', async (req, res) => {
  try {
    const {
      studentNaam, studentNummer,
      bedrijfNaam, bedrijfAdres,
      mentorNaam, mentorEmail,
      opdrachtOmschrijving,
      periodeStart, periodeEind
    } = req.body;

    const cookieUser = req.cookies.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });

    const studentProfile = await Student.findByPk(cookieUser.user_id);
    if (!studentProfile) return res.status(400).json({ msg: 'Geen studentprofiel gevonden' });
    const student_id = studentProfile.user_id;

    const bedrijf = await Bedrijf.create({ naam: bedrijfNaam, address: bedrijfAdres });

    const mentorUser = await User.create({
      first_name: mentorNaam,
      last_name: '',
      email: mentorEmail,
      password: 'pending',
      role: 'stagementor',
      phone: 'no phone'
    });
    await Stagementor.create({ user_id: mentorUser.user_id, bedrijf_id: bedrijf.bedrijf_id });

    const stage = await Stage.create({
      student_id,
      mentor_id: mentorUser.user_id,
      bedrijfs_id: bedrijf.bedrijf_id,
      omschrijving_opdracht: opdrachtOmschrijving,
      status: 'Aanvraag',
      begin_datum: periodeStart,
      eind_datum: periodeEind
    });

    return res.status(201).json({ msg: 'Stage succesvol aangemaakt', data: stage });
  } catch (error) {
    console.error('Error creating stage:', error);
    return res.status(500).json({ msg: 'Er is iets misgegaan bij het aanmaken van de stage' });
  }
});

// ✅ GET goedgekeurde stages (moet vóór /:id staan)
app.get('/api/stages/goedgekeurd', async (req, res) => {
  try {
    const stages = await Stage.findAll({
      where: { status: 'Goedgekeurd' },
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
        { model: Bedrijf, as: 'bedrijf' },
      ],
    });
    return res.json(stages.map(s => ({
      id: s.stage_id,
      naam: s.student?.User ? `${s.student.User.last_name.toUpperCase()} ${s.student.User.first_name}` : 'Onbekend',
      bedrijf: s.bedrijf?.naam || '',
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij ophalen stages' });
  }
});

// ✅ GET alle docenten
app.get('/api/docenten', async (req, res) => {
  try {
    const docenten = await Docent.findAll({
      include: [{ model: User, as: 'User' }]
    });
    return res.json(docenten.map(d => ({
      user_id: d.user_id,
      first_name: d.User.first_name,
      last_name: d.User.last_name,
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij ophalen docenten' });
  }
});

// ✅ PUT docent koppelen aan stage
app.put('/api/stages/:id/docent', async (req, res) => {
  try {
    const { docent_id } = req.body;
    const stage = await Stage.findByPk(req.params.id);
    if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });
    await stage.update({ docent_id });
    return res.json({ msg: 'Docent gekoppeld' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Fout bij koppelen docent' });
  }
});

// ✅ GET stage by ID
app.get('/api/stages/:id', async (req, res) => {
  try {
    const stage = await Stage.findByPk(req.params.id, {
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
        { model: Stagementor, as: 'mentor', include: [{ model: User, as: 'User' }] },
        { model: Bedrijf, as: 'bedrijf' },
        { model: Docent, as: 'docent', include: [{ model: User, as: 'User' }] },
      ]
    });

    if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });

    const studentUser = stage.student ? stage.student.User : null;
    const mentorUser = stage.mentor ? stage.mentor.User : null;
    const docentUser = stage.docent ? stage.docent.User : null;

    return res.json({
      id: stage.stage_id,
      naam: studentUser ? `${studentUser.first_name} ${studentUser.last_name}` : '',
      studentEmail: studentUser ? studentUser.email : '',
      functie: '',
      bedrijf: {
        naam: stage.bedrijf ? stage.bedrijf.naam : '',
        adres: stage.bedrijf ? stage.bedrijf.address : '',
      },
      stagementor: {
        naam: mentorUser ? `${mentorUser.first_name} ${mentorUser.last_name}` : '',
        email: mentorUser ? mentorUser.email : '',
      },
      docent: {
        naam: docentUser ? `${docentUser.first_name} ${docentUser.last_name}` : '',
        email: docentUser ? docentUser.email : '',
        user_id: stage.docent_id || null,
      },
      stageDetails: {
        omschrijving: stage.omschrijving_opdracht || '',
        start: stage.begin_datum || '',
        einde: stage.eind_datum || '',
      },
      status: stage.status === 'Aanvraag' ? 'in_afwachting'
        : stage.status === 'Goedgekeurd' ? 'goedgekeurd'
        : stage.status === 'Afgekeurd' ? 'afgekeurd'
        : stage.status === 'Aanpassingen_vereist' ? 'aanpassingen'
        : stage.status,
      rawStatus: stage.status,
      datum: stage.createdAt ? new Date(stage.createdAt).toLocaleDateString('nl-BE') : '',
      feedback: stage.feedback || null,
    });
  } catch (error) {
    console.error('Error fetching stage:', error);
    return res.status(500).json({ msg: 'Fout bij ophalen van stage' });
  }
});

// ✅ GET stage by student_id
app.get('/api/stages/student/:studentId', async (req, res) => {
  try {
    const stage = await Stage.findOne({
      where: { student_id: req.params.studentId },
      include: [
        { model: Student, as: 'student', include: [{ model: User, as: 'User' }] },
        { model: Stagementor, as: 'mentor', include: [{ model: User, as: 'User' }] },
        { model: Bedrijf, as: 'bedrijf' },
        { model: Docent, as: 'docent', include: [{ model: User, as: 'User' }] },
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!stage) return res.json({ found: false });

    const studentUser = stage.student ? stage.student.User : null;
    const mentorUser = stage.mentor ? stage.mentor.User : null;
    const docentUser = stage.docent ? stage.docent.User : null;

    return res.json({
      found: true,
      id: stage.stage_id,
      naam: studentUser ? `${studentUser.first_name} ${studentUser.last_name}` : '',
      studentEmail: studentUser ? studentUser.email : '',
      studentNummer: stage.student ? stage.student.studentnummer : '',
      bedrijf: {
        naam: stage.bedrijf ? stage.bedrijf.naam : '',
        adres: stage.bedrijf ? stage.bedrijf.address : '',
      },
      stagementor: {
        naam: mentorUser ? `${mentorUser.first_name} ${mentorUser.last_name}` : '',
        email: mentorUser ? mentorUser.email : '',
      },
      docent: {
        naam: docentUser ? `Prof. ${docentUser.first_name} ${docentUser.last_name}` : '',
      },
      stageDetails: {
        omschrijving: stage.omschrijving_opdracht || '',
        start: stage.begin_datum || '',
        einde: stage.eind_datum || '',
      },
      status: stage.status === 'Aanvraag' ? 'in_afwachting'
        : stage.status === 'Goedgekeurd' ? 'goedgekeurd'
        : stage.status === 'Afgekeurd' ? 'afgekeurd'
        : stage.status === 'Aanpassingen_vereist' ? 'aanpassingen'
        : stage.status,
      rawStatus: stage.status,
      datum: stage.createdAt ? new Date(stage.createdAt).toLocaleDateString('nl-BE') : '',
      feedback: stage.feedback || null,
    });
  } catch (error) {
    console.error('Error fetching student stage:', error);
    return res.status(500).json({ msg: 'Fout bij ophalen van stage' });
  }
});

// ✅ PUT update stage
app.put('/api/stages/:id', async (req, res) => {
  try {
    const { status, feedback, bedrijfNaam, bedrijfAdres, mentorNaam, mentorEmail, omschrijving_opdracht, begin_datum, eind_datum } = req.body;

    const stage = await Stage.findByPk(req.params.id, {
      include: [
        { model: Bedrijf, as: 'bedrijf' },
        { model: Stagementor, as: 'mentor' },
      ]
    });

    if (!stage) return res.status(404).json({ msg: 'Stage niet gevonden' });

    const updateData = {};
    if (status) updateData.status = status;
    if (feedback !== undefined) updateData.feedback = feedback;
    if (omschrijving_opdracht !== undefined) updateData.omschrijving_opdracht = omschrijving_opdracht;
    if (begin_datum !== undefined) updateData.begin_datum = begin_datum;
    if (eind_datum !== undefined) updateData.eind_datum = eind_datum;

    await stage.update(updateData);

    if (bedrijfNaam && stage.bedrijf) {
      await stage.bedrijf.update({ naam: bedrijfNaam, address: bedrijfAdres || stage.bedrijf.address });
    }
    if (mentorNaam && stage.mentor) {
      const mentorUser = await User.findByPk(stage.mentor.user_id);
      if (mentorUser) await mentorUser.update({ first_name: mentorNaam });
    }
    if (mentorEmail && stage.mentor) {
      const mentorUser = await User.findByPk(stage.mentor.user_id);
      if (mentorUser) await mentorUser.update({ email: mentorEmail });
    }

    return res.json({ msg: 'Stage succesvol bijgewerkt', data: stage });
  } catch (error) {
    console.error('Error updating stage:', error);
    return res.status(500).json({ msg: 'Fout bij bijwerken van stage' });
  }
});

// ✅ Admin upload document
app.post('/api/documents/admin-upload', upload.single('document'), async (req, res) => {
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
});

// ✅ Student upload document
app.post('/api/documents/student-upload', upload.single('document'), async (req, res) => {
  try {
    const cookieUser = req.cookies.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const stage = await Stage.findOne({ where: { student_id: cookieUser.user_id } });
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
});

// ✅ GET documenten voor ingelogde student
app.get('/api/documents/mijn', async (req, res) => {
  try {
    const cookieUser = req.cookies.user;
    if (!cookieUser) return res.status(401).json({ msg: 'Niet ingelogd' });
    const stage = await Stage.findOne({ where: { student_id: cookieUser.user_id } });
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
});

// ✅ GET documenten voor een stage (admin)
app.get('/api/documents/stage/:stageId', async (req, res) => {
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
});

// ✅ Download document
app.get('/api/documents/:id/download', async (req, res) => {
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
});

app.listen(3000, () => {
  console.log('✅ Server running on 3000');
});