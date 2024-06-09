import { Router } from "express"
import { RegisterUser, googleget, googleLoginPage, LoginUser, LogoutUser, refershAccessToken } from "../controllers/user.controller.js"
import { findMatch } from "../controllers/play.controller.js"
import { sendOTP } from "../controllers/otp.controller.js"
import { compileCode, submitCode } from '../controllers/compile.controller.js';
import { addQuestion } from '../controllers/question.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

// Define routes
router.post("/sendOTP", sendOTP);
router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/logout", verifyJWT, LogoutUser);
router.post("/refresh-token",refershAccessToken);
// router.route("/google").get(googleget);
// router.route("/google/login").get(googleLoginPage);

// router.post("/compile",verifyJWT, compileCode);
// router.post("/submit",verifyJWT, submitCode);
// router.post("/addquestion",verifyJWT, addQuestion); // New route for adding questions

router.post("/compile", compileCode);
router.post("/submit",verifyJWT, submitCode);
router.post("/addquestion",verifyJWT, addQuestion); 

router.post('/find-match', verifyJWT, findMatch);


export default router;
