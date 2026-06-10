import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/user.js';
import Student from '../db/userModel/student.js';
import Stagementor from '../db/userModel/stagementor.js';
import Bedrijf from '../db/objectModel/bedrijf.js';
import Stage from '../db/objectModel/stage.js';
import Docent from '../db/userModel/docent.js';


const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS met cookies
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:5173',
      'http://127.0.0.1:5500'
    ];

    // allow requests without Origin (e.g. curl / same-origin)
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ start DB
await run();

// ✅ LOGIN + COOKIE
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.json({ success: false, message: 'Foute login' });
    }

    // 🔥 COOKIE zetten
    res.cookie('user', {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      role: user.role
    }, {
      httpOnly: true,          // 🔒 veiliger
      maxAge: 1000 * 60 * 60,  // 1 uur
      sameSite: 'lax'
    });

    // ✅ stuur rol mee zodat main.js meteen de juiste pagina toont
    res.json({
      success: true,
      message: 'Login succesvol',
      user: {
        first_name: user.first_name,
        role: user.role
  
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ✅ CHECK login via cookie
app.get('/me', (req, res) => {
  if (req.cookies.user) {
    res.json({ loggedIn: true, user: req.cookies.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// ✅ LOGOUT
app.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.json({ success: true });
});

// ✅ STAGES API (Database)
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
        },
        stageDetails: {
          omschrijving: s.omschrijving_opdracht || '',
          start: s.begin_datum || '',
          einde: s.eind_datum || '',
          urenPerWeek: '',
        },
        status: s.status === 'Aanvraag' ? 'in_afwachting' : s.status === 'Goedgekeurd' ? 'goedgekeurd' : s.status === 'Afgekeurd' ? 'afgekeurd' : s.status,
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

app.post('/api/stages', async (req, res) => {
  try {
    const {
      studentNaam, studentNummer,
      bedrijfNaam, bedrijfAdres,
      mentorNaam, mentorEmail,
      opdrachtOmschrijving,
      periodeStart, periodeEind
    } = req.body;

    // 1. Get student_id from cookie
    const cookieUser = req.cookies.user;
    if (!cookieUser) {
      return res.status(401).json({ msg: 'Niet ingelogd' });
    }
    const studentProfile = await Student.findByPk(cookieUser.user_id);
    if (!studentProfile) {
      return res.status(400).json({ msg: 'Geen studentprofiel gevonden' });
    }
    const student_id = studentProfile.user_id;

    // 2. Create Bedrijf
    const bedrijf = await Bedrijf.create({
      naam: bedrijfNaam,
      address: bedrijfAdres
    });

    // 3. Create Stagementor user + sub-profile
    const mentorUser = await User.create({
      first_name: mentorNaam,
      last_name: '',
      email: mentorEmail,
      password: 'pending',
      role: 'stagementor',
      phone: 'no phone'
    });
    await Stagementor.create({
      user_id: mentorUser.user_id,
      bedrijf_id: bedrijf.bedrijf_id
    });

    // 4. Create Stage
    const stage = await Stage.create({
      student_id,
      mentor_id: mentorUser.user_id,
      bedrijfs_id: bedrijf.bedrijf_id,
      omschrijving_opdracht: opdrachtOmschrijving,
      status: 'Aanvraag',
      begin_datum: periodeStart,
      eind_datum: periodeEind
    });

    return res.status(201).json({
      msg: 'Stage succesvol aangemaakt',
      data: stage
    });
  } catch (error) {
    console.error('Error creating stage:', error);
    return res.status(500).json({ msg: 'Er is iets misgegaan bij het aanmaken van de stage' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on 3000');
});