import User from "../models/User.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async(req,res)=>{

    const {FullName,Email,Password} = req.body;

    try{
        if(!FullName||!Email||!Password) 
            return res.status(400).json({message:"All fields are req"});

        if(Password.length<6) 
            return res.status(400).json({message:"All fields are req"});
        
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!emailRegex.test(Email))
            return res.status(400).json({message:"All fields are req"});
 
        const user = await User.findOne({Email});
        if(user) return res.status(400).json({message:"Email already Exit"});
        
        //password hashing ==> bycrpt 
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(Password,salt);

        const newuser = new User({
            FullName,
            Email,
            Password:hashedpassword
        });

        if(newuser){
            // generateToken(newuser._id,res); potential issue
            const Saved_user= await newuser.save();
            generateToken(Saved_user._id,res);


            res.status(201).json({
                _id:newuser._id,
                FullName:newuser.FullName,
                Email:newuser.Email,
                profilePic:newuser.profilePic
            })
        }else{
            res.status(400).json({message:"Invalid User"});
        }

        
    }catch(err){
        console.log("Error in signup controller:",err);
        res.status(500).json({message:"Internal server error"});
    }

};