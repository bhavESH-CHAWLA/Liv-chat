import mongoose from "mongoose"

export const connectdb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("db is connected:" , conn.connection.host);
    }catch(err){
        console.log("ERROR:",error);
        process.exit(1) //1 is fails and zero is success
        
    }
}