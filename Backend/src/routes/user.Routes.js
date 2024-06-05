import express from 'express';
import { RegisterUser } from '../controllers/user.controller.js';
import { sendOTP } from '../controllers/otp.controller.js';
import { compileCode, submitCode } from '../controllers/compile.controller.js';
import { addQuestion } from '../controllers/question.controller.js';

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Define routes
router.post('/sendOTP', sendOTP);
router.post('/register', RegisterUser);

router.post('/compile', compileCode);
router.post('/submit', submitCode);

router.post('/addquestion', addQuestion); // New route for adding questions

export default router;
