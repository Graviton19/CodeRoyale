import { Router } from "express"
import { RegisterUser } from "../controllers/user.controller.js"
import { sendOTP } from "../controllers/otp.controller.js"
const router = Router()

router.route("/sendOTP").post(sendOTP)

router.route("/register").post(RegisterUser)

export default router



