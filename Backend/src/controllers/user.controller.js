import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Otp } from "../models/otp.models.js"
import passport from "passport"
import jwt from "jsonwebtoken"
import { request } from "express"

const generateAccessAndRefreshTokens = async(userId,email) => {
    try {
        const user = await User.findOne({
            $or: [{userId},{email}]
        });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error("Error in generateAccessAndRefreshTokens:", error);
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
};


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

// const googleget = (req, res) => { 
//     res.send("<button><a href='/auth'>Login With Google</a></button>") 
// }; 

// const googleLoginPage = passport.authenticate('google', { scope: [ 'email', 'profile' ] })

const LoginUser = asyncHandler(async(req,res)=>{
    const { email,password } = req.body
    if(!email)
    {
        throw new ApiError(400,"Email is required")
    }
    if(!password)
    {
        throw new ApiError(400,"Password is required")
    }
    const user = await User.findOne({email})

    if(!user)
    {
        throw new ApiError(404,"User with given email does not exist")
    }
    const PasswordCorrect = await user.isPasswordCorrect(password)
    if(!PasswordCorrect)
    {
        throw new ApiError(401,"Invalid Password")
    }
    const { accessToken,refreshToken } = await generateAccessAndRefreshTokens(user._id, null)

    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const Options = {
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,Options)
    .cookie("refreshToken",refreshToken,Options)
    .json(
        new ApiResponse(
            200,
            {
                user:LoggedInUser, accessToken, refreshToken              
            },
            "user logged in successfully"
        )
    )

})

const GoogleLogin = async(req,res) => {
    try {
        const { email } = req.user

        const { accessToken,refreshToken } = await generateAccessAndRefreshTokens(null,email)

        const LoggedInUser = await User.findOne({email}).select("-password -refreshToken")
    
        const Options = {
            httpOnly : true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,Options)
        .cookie("refreshToken",refreshToken,Options)
        .json(
            new ApiResponse(
                200,
                {
                    user:LoggedInUser, accessToken, refreshToken              
                },
                "user logged in successfully"
            )
        )
    
    } catch (error) {
        ApiError(401,"Unauthorized request")
    }
}


const LogoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken : undefined
            }
        },
        {
            new: true
        }
    )
    const Options = {
        httpOnly : true,
        secure: true
    }

    res
    .status(200)
    .clearCookie("accessToken",Options)
    .clearCookie("refreshToken",Options)
    .json(
        new ApiResponse(200,{},"User Logged Out")
    )
})

const refershAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken)
    {
        throw new ApiError(401,"Unauthorized request")
    }
   try {
     const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
     const user =  await User.findById(decodedToken?._id)
     
     if(!user)
     {
         throw new ApiError(401,"Invalid refersh token")
     }
 
     if(incomingRefreshToken !== user?.refreshToken ){
         throw new ApiError(401,"Refresh Token is expired or used")
     }
 
     const Options = {
         httpOnly : true,
         secure: true
     }
 
     const { accessToken,newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
 
     return res
     .status(200)
     .cookie("accessToken",accessToken,Options)
     .cookie("refreshToken",newRefreshToken,Options)
     .json(
         new ApiResponse(
             200,
             {
                 accessToken , refreshToken: newRefreshToken
             },
             "Access Token Refreshed"
         )
     )
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
   }
})


export {
        RegisterUser,
        LoginUser,
        LogoutUser,
        refershAccessToken,
        GoogleLogin
       }
