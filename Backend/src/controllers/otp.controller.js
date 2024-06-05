import otpGenerator from "otp-generator"
import { Otp } from "../models/otp.models.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js";

const sendOTP = async (req, res) => {
    try {
      const { email } = req.body;

      const checkUserPresent = await User.findOne({ email });
  
      if (checkUserPresent) {
        throw new ApiError(400, "User already exists");
      }
  
      

      // Generate a new OTP
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      let result = await Otp.findOne({ otp: otp });
  
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        });
        result = await Otp.findOne({ otp: otp });
      }

      const checkInOtpDb = await Otp.findOne({ email });
  
      if (!checkInOtpDb) {
        const otpPayload = { email, otp };
        await Otp.create(otpPayload);
      } else {
        await Otp.findOneAndUpdate(
          { email: email },
          { $set: { otp: otp } },
          { new: true }
        );
      }
  
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp,
      });
  
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error in generation of OTP',
        });
      }
    }
};
  
export {sendOTP}    