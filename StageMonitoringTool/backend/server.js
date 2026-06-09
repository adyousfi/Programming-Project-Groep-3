import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/users/user.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

// start DB
await run();

// ✅ LOGIN + COOKIE

app.post('/login', async (req, res) => {
  console.log("BODY:", req.body);

  const { email, password } = req.body;

  try {
    // 🔥 test zonder password eerst
    const user = await User.findOne({
      where: { email }
    });

    console.log("USER:", user);

    if (!user) {
      return res.json({ success: false, message: 'User niet gevonden' });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: 'Fout wachtwoord' });
    }

    res.json({ success: true, user });

  } catch (error) {
    console.error("LOGIN ERROR:", error); // 🔥 HIER STAAT JE FOUT
    res.status(500).json({ success: false });
  }
});


// ✅ CHECK COOKIE
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