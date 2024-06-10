import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import { configurePassport } from "./utils/googleLogin.js"
const app = express()

app.use(cookieParser())

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))


app.use(express.json(
    {
        limit: "16kb"
    }
))

app.use(express.urlencoded({
    extended: true, limit: "16kb"
}))

app.use(express.static("public"))

app.use(session({
    secret: process.env.SESSION_SECRET, // Use a secure key in production
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

configurePassport()


// app.use(cookieSession({ 
//     name: 'google-auth-session', 
//     keys: ['key1', 'key2'] 
// })); 
// app.use(passport.initialize()); 




// app.use(passport.session()); 

import userRouter from "./routes/user.Routes.js"

app.use("/api/v1/users",userRouter)

import authRouter from "./routes/auth.Routes.js"

app.use('/api/v1/auth', authRouter);

export {app} 