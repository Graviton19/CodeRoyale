import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { User } from "../models/user.models.js";

const generateUniqueUsername = async(basename)=>{
    let username = basename
    let userExists = await User.findOne({username})
    let count = 1;
    while(userExists)
    { 
      username = `${basename}${count}`;
      userExists = await User.findOne({username})
      count++;
    }
    return username;
};

const configurePassport = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = await User.findOne({ email: profile.emails[0].value });
                if (!user) {
                  const baseUsername = profile.displayName.replace(/\s+/g, '').toLowerCase();
                  const uniqueUsername = await generateUniqueUsername(baseUsername);
                    user = new User({
                        googleId: profile.id,
                        username: uniqueUsername,
                        email: profile.emails[0].value
                    });
                } else {
                    user.googleId = profile.id;
                }
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));
}

export { configurePassport };
