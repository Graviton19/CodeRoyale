import { Router } from "express"
import { RegisterUser, googleget, googleLoginPage } from "../controllers/user.controller.js"
import { sendOTP } from "../controllers/otp.controller.js"
import { CompileCode } from "../controllers/compile.controller.js"
const router = Router()

router.route("/sendOTP").post(sendOTP)

router.route("/register").post(RegisterUser)

router.route("/compile").post(CompileCode)

router.route("/google").get(googleget)

router.route("/google/login").get(googleLoginPage)

export default router



