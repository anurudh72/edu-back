import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import Users from './models/userModel.js'
import courseRoutes from './routes/courses.js'
import userRoutes from './routes/users.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const app = express()

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use('/home', courseRoutes)
// app.use('/user', userRoutes)
app.post('/user/signin', async (req, res) =>{
    const {email, password} = req.body;
    console.log(req.body);
    try{
        const existingUser = await Users.findOne({email})
        console.log(existingUser)
        if(!existingUser) return res.status(404).json({message: "User doesn't exist "})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)        
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials!"})

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id  }, 'test', { expiresIn: "1hr" })

        res.status(200).json({result: existingUser, token})
    } catch{
        res.status(500).json({message: "Something went wrong!"})

    }
})
app.post('/user/signup', async (req, res) => {
        const {email, firstName, lastName, password, confirmPassword, } = req.body;
        console.log(req.body);
        try{
            
            const existingUser = await Users.findOne({email});
            if(existingUser) return res.status(400).json({message:"User already exists."})
            if(confirmPassword != password ) return res.status(400).json({message:"Passwords don't match."})
    
            const hashedPassword = await bcrypt.hash(password, 12)
            const result = await Users.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`})
    
            const token = jwt.sign({ email: result.email, id:result._id }, 'test', { expiresIn:"1h"})
            res.status(200).json({result, token});
    
        } catch{ 
            res.status(500).json({message: "Something went wrong!"})
        }
    } 
)

const connection_URL = 'mongodb+srv://project2:project2@cluster0.nh4rgg4.mongodb.net/?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false)
mongoose.
    connect(connection_URL)

    .then(() => {
        console.log('connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Node API app is running on port ${PORT}`)
        });
    }).catch((error) => {
        console.log(error)
    }) 
