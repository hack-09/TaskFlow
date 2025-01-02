const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async(req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    try{
        const existingUSer = await User.findOne({email});

        if(existingUSer){
            return res.status(400).json({message : "User already exists"});
        }

        const newUser = new User({name, email, password});
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
});


router.post("/login", async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ message : "All field are required"});
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        const matchPass = await bcrypt.compare(password, user.password);

        if(!matchPass){
            return res.status(400).json({message: "Invalid user credentials"});
        }

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.status(200).json({token , user : { id : user._id, name :  user.name, email : user.email}});
    }
    catch(err){
        res.status(500).json({message : "Server Error"});
    }
});

module.exports = router;
