
const bcrypt = require('bcrypt');

const User = require('../schema/userSchema');

exports .register=async(req,res)=>{
    const user=req.body
    const{name,email,password,role}=user
    try{
        const existingUser=await User.findOne({email: email})
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }   
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser= new User({
            name,
            email,
            password:hashedPassword,
            role: role,
        })
        await newUser.save()
        res.status(201).json({message:"User registered successfully", User: newUser})
    }
    catch(error){
        console.error("Error registering user:", error)
        res.status(500).json({message: "Internal server error"})
    }
}