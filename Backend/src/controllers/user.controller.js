import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Otp } from "../models/otp.models.js"

const RegisterUser = asyncHandler(async(req,res)=>{
    const {email , username, password , otp} = req.body
    if(email.trim() === "")
    {
        throw new ApiError(400,"email is required")
    }
    if(password.trim() === "")
    {
        throw new ApiError(400,"Password is required")
    }
    if(username.trim() === "")
    {
        throw new ApiError(400,"username is required")
    }
    if(otp.trim() === "")
    {
        throw new ApiError(400,"otp is required")
    }
    const existedUser = await User.findOne({
        $or: [{email},{username}]   
    })
    if(existedUser)
    {
        throw new ApiError(400,"User with given email or username exists")
    }
    const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid',
      });
    }

    const user = await User.create({
        email, 
        password,
        username: username.toLowerCase()
    })

    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export {RegisterUser}