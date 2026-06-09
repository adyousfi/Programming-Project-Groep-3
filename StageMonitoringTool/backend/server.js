import cors from 'cors';
import express from 'express';
import { run } from '../db/dbConnection.js';
import User from '../db/userModel/users/user.js';
import cookieParser from 'cookie-parser';
const app = express();


app.use(express.json());

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

app.get('/me', (req, res) => {
    const user = req.cookies.user;

    if (user) {
        res.json({ loggedIn: true, user });
    } else {
        res.json({ loggedIn: false });
    }
})
app.post('/logout', (req, res) => {
    res.clearCookie('user');
    res.json({ success: true });
});


// POST login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email, password } });

        if (user) {

            // ✅ Cookie zetten (1 uur geldig)
            res.cookie('user', {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            }, {
                httpOnly: true,           // niet via JS uitleesbaar (veiliger)
                maxAge: 1000 * 60 * 60,   // 1 uur
                sameSite: 'lax'
            });

            res.json({
                success: true,
                user: {
                    user_id: user.user_id,
                    first_name: user.first_name,
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