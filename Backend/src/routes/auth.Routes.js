import { Router } from "express"
import { LogoutUser, GoogleLogin } from "../controllers/user.controller.js"
import passport from "passport"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    GoogleLogin
);

router.get('/logout', verifyJWT,LogoutUser);

export default router;