import { Router } from "express"
import { RegisterUser } from "../controllers/user.controller.js"
import { sendOTP } from "../controllers/otp.controller.js"
import { CompileCode } from "../controllers/compile.controller.js"
const router = Router()

router.route("/sendOTP").post(sendOTP)

router.route("/register").post(RegisterUser)

router.route("/compile").post(CompileCode)

export default router



