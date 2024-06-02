import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

const connectDB = async()=>{
    try {
        console.log(process.env.MONGODB_URI,DB_NAME)
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      
        console.log("\n MongoDB connected")
    } catch (error) {
        console.log("MongoDB connection error: ",error)
        process.exit(1)
    }
}

export default connectDB 