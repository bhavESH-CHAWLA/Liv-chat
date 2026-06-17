import User from "../models/User.js"
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

        
    }catch(err){

    }

};