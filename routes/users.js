import express from 'express'
import { signup, signin } from '../controllers/users.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const userRoutes = express.Router();
userRoutes.use(bodyParser.json());
userRoutes.use(cors());

userRoutes.post('/signin', signin)
// userRoutes.post('/signup', signup)
userRoutes.post('/signup', async (req, res) => {
    const {email, firstName, lastName, password, confirmPassword, } = req.body;
    console.log(req.body);
    try{
        
        const existingUser = await Users.findOne({email});
        if(existingUser) return res.status(400).json({message:"User already exists."})
        if(confirmPassword != password ) return res.status(400).json({message:"Passwords don't match."})

        const hashedPassword = await bcrypt.hash(password, 12)
        const result = await Users.create({ email, password: hashedPassword,firstName, lastName})
        console.log(result)
        // const token = jwt.sign({ email: result.email, id:result._id }, 'test', { expiresIn:"1h"})
        // console.log( token);
        // res.status(200).json({result, token});
        res.status(200).json(result);
    } catch{ 
        res.status(500).json({message: "Something went wrong!"})
    }
} 
)

export default userRoutes;