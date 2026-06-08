
import cors from 'cors';
import express from 'express';
import userRouter from './user.js';
import User from '.../db/controllers/userController';

const app = express();

let users = []

const loadUsers = async () => {
    try {
        users = await User.findAll()
        console.log(`✓ ${users.length} users geladen`)
    } catch (error) {
        console.error('✗ Fout bij laden van users:', error)
    }
}

    app.use(express.json())
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500']
}))
app.use('/user', userRouter)

            app.post('/login', (req, res) => {
    const { email, password } = req.body

    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
        res.json({
            success: true,
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            },
            message: "Login succesvol!"
        })
    } else {
        res.json({ success: false, message: "Email of wachtwoord onjuist!" })
    }
})

app.get('/name/:id', (req, res) => {
    const id = Number(req.params.id)
    const user = users.find(u => u.user_id == id)
    
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ message: "User niet gevonden" })
    }
})

await loadUsers()
app.listen(3000, () => {
    console.log("✓ Server running on port 3000")
})