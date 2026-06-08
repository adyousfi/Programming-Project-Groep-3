import cors from 'cors';
import express from 'express';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/users/user.js';

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5173','http://localhost:3000']
}));

await run();

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User niet gevonden' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

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