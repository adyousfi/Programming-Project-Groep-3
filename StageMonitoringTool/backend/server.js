const cors = require('cors')
const express = require('express')
const userRouter = require('./user')
const app = express()

const { User } = require('../db/controllers/userController') // pas pad aan naar jouw models
const users = [
    
    
]

app.use(express.json())

app.use(cors({
    origin:['http://127.0.0.1:5500', 'http://localhost:5500']
}))

app.use('/user',userRouter)

app.get('/',(req,res)=>{
    res.send("hallo from experss")
})

app.get('/name',(req,res)=>{
    res.json([
       {id:1, naam:'jan', psw:'admin123'}
    ])
})
app.get('/message',(req,res)=>{
    res.json({message:"hi"})
})

app.post('/message',(req,res)=>{
    const { name, message } = req.body
    res.json({
        success: true,
        received: {
            name: name,
            message: message
        },
        status: "Message received!"
    })
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    
    try {
        const users = await User.findAll()
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
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
})

app.get('/name/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id) // directere aanpak
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

app.listen(300,()=>{
    console.log("✓ Server running on port 300")
})