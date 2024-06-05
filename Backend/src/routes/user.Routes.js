import express from 'express';
import { RegisterUser } from '../controllers/user.controller.js';
import { sendOTP } from '../controllers/otp.controller.js';
import compileCode from '../controllers/compile.controller.js';

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Define routes
router.post('/sendOTP', sendOTP);
router.post('/register', RegisterUser);


router.post('/compile', compileCode);

// Debugging logs for route configuration
// console.log('Routes configured:');
// router.stack.forEach((r) => {
//     if (r.route && r.route.path && r.route.methods) {
//         console.log(`${r.route.path} - ${r.route.methods}`);
//     } else {
//         console.log('Unknown route:', r);
//     }
// });



export default router;
