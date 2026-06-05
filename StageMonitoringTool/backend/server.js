const cors =require('cors')
const express =require('express')
const userRouter =require('./user')
const app = express()

app.use(express.json())

app.use(cors({
    origin:['http://127.0.0.1:5500', 'http://localhost:5500']
}))

app.use(express.json())

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

app.post('/login',(req,res)=>{
    const { email, password } = req.body
    

    
    const user = users.find(u => u.email === email && u.password === password)
    
    if(user) {
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
        res.json({
            success: false,
            message: "Email of wachtwoord onjuist!"
        })
    }
})

app.listen(300,()=>{
    console.log("✓ Server running on port 300")
})

app.get('/name/:id',(req,res)=>{
    const id =Number(req.params.id)

    const users=([
       {id:1, naam:'jan', psw:'admin123'},
       {id:2, naam:'bob', psw:'admin123'}
    ])
    const requireduser= users.find((users)=>users.id==id)
    res.json(requireduser)
})

app.post('/message',(req,res)=>{
    const {name,message}= req.body

})