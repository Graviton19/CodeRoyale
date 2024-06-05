import { Router } from "express"
import { RegisterUser, googleget, googleLoginPage } from "../controllers/user.controller.js"
import { sendOTP } from "../controllers/otp.controller.js"
import { CompileCode } from "../controllers/compile.controller.js"
import { compileCode, submitCode } from '../controllers/compile.controller.js';
import { addQuestion } from '../controllers/question.controller.js';

const router = Router()

// Middleware to parse JSON bodies
router.use(express.json());

router.route("/compile").post(CompileCode)

router.route("/google").get(googleget)

router.route("/google/login").get(googleLoginPage)
// Define routes
router.post('/sendOTP', sendOTP);
router.post('/register', RegisterUser);

router.post('/compile', compileCode);
router.post('/submit', submitCode);

router.post('/addquestion', addQuestion); // New route for adding questions

export default router;
