import passport from "passport" 
import { Strategy as GoogleStrategy } from "passport-google-oauth2"
  
const configurePassport = () => {
passport.serializeUser((user , done) => { 
    done(null , user); 
}) 
passport.deserializeUser(function(user, done) { 
    done(null, user); 
}); 
  
passport.use(new GoogleStrategy({ 
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL:"http://localhost:3000/users/google", 
    passReqToCallback:true
  }, 
  function(request, accessToken, refreshToken, profile, done) { 
    return done(null, profile); 
  } 
));
}

export {configurePassport}
