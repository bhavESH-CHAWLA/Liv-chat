import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    Email:{
        type:String,
        required:true,
        unique:true,

    },
    FullName :{
        type:String,
        required:true 
    },
    Password:{
        type:String,
        required:true,
        minlength:6,

    },
    profilePic:{
        type:String,
        default:"",

    },
    
},{timestamps:true})//created at and for updated at

const User = mongoose.model("User",UserSchema);

export default User;
