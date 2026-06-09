import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/users/user.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS met cookies
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5500','http://localhost:5173/'],
  credentials: true
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

    res.json({
      success: true,
      message: 'Login succesvol',
      user: {
        first_name: user.first_name
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