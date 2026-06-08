import cors from 'cors';
import express from 'express';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/users/user.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5173']
}));

// Connect to DB
await run();

// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET user by id
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User niet gevonden' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email, password } });
        if (user) {
            res.json({
                success: true,
                user: {
                    user_id:    user.user_id,
                    first_name: user.first_name,
                    last_name:  user.last_name,
                    email:      user.email,
                    role:       user.role
                },
                message: 'Login succesvol!'
            });
        } else {
            res.json({ success: false, message: 'Email of wachtwoord onjuist!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(3000, () => {
    console.log('✓ Server running on port 3000');
});
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = usernameInput.value.trim();
  const password = passwordInput.value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      sessionStorage.setItem('loggedInUser', data.user.first_name + ' ' + data.user.last_name);
      sessionStorage.setItem('userRole', data.user.role);

      if (data.user.role === 'student') {
        window.location.href = '/?role=student';
      } else if (data.user.role === 'stagecommisie') {
        window.location.href = '/?role=stagecommissie';
      } else {
        window.location.href = '/';
      }
    } else {
      errorDiv.style.display = 'block';
      errorDiv.textContent = data.message;
    }
  } catch (err) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Kan geen verbinding maken met de server.';
  }
});