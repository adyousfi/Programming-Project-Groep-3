import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/users/user.js';

const app = express();  // ← eerst app aanmaken

app.use(express.json());
app.use(cookieParser());  // ← dan pas gebruiken
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5173'],
    credentials: true
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

const SECRET = process.env.JWT_SECRET || 'geheim123';
// POST login


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email, password } });
        if (user) {
            const token = jwt.sign(
                { user_id: user.user_id, role: user.role },
                SECRET,
                { expiresIn: '8h' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 8 * 60 * 60 * 1000
            });

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

// Middleware om token te checken op beveiligde routes
function checkToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Geen token' });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(401).json({ message: 'Ongeldig token' });
    }
}

/// Uitloggen
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
});

