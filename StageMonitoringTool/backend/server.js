import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/user.js';
import { renderAanvragen } from '../src/admin/admin.js';
import { renderStudentDashboard } from './student/student.js';
import { renderStageformulier } from './student/formulier.js';
import { renderWachten } from './student/wachten.js';
import { renderFeedback } from './student/feedback.js';
import { renderAanpassen } from './student/aanpassen.js';
import { renderMijnStagiairs } from './stagementor/mijn-stagiairs.js';
import { renderMijnStudenten } from './docent/mijn-studenten.js';
import { renderGoedgekeurdStudent } from './student/goedgekeurd_student.js';
import { renderDocumenten } from './student/documenten.js';
import { renderAdmin } from './admin/admin.js';

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

app.listen(3000, () => {
  console.log('✅ Server running on 3000');
});