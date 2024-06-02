<<<<<<< HEAD
const express = require('express');
const { compileCode } = require('./utils/rapidaApiSetup');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route to handle code compilation and execution
app.post('/compile', compileCode);

// Start the Express.js server
app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});
=======
import connectDB from "./db/connection.js"
import dotenv from "dotenv"
import { app } from "./app.js"

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed!!",err)
})
>>>>>>> 487763171cf2d2106ab79d939d7d44022bf77859
