const User = require ("../models/student.model.js")
const ApiResponse = require("../utils/api-response.js");
const ApiError = require("../utils/api-error.js");
const asyncHandler = require("../utils/async-handler.js")
const { sendMail, emailVerificationMailGenContent, forgotPasswordMailGenContent } = require ("../utils/mail.js");


genrateAccessAndRefreshToken = async(userID)=>{
    try{
        const user = await User.findById(userID)
        const accessToken =user.generateAccessToken();
        const refreshToken =user.generateRefreshToken();

        user.refreshtoken = refreshToken
        await user.save({validateBeforeSave:false})
        return{accessToken,refreshToken }
    }
    catch(error){
        throw new ApiError(500,"Something Went Wrong White Genreting access token")
    }
}

const registerUser = asyncHandler(async (req, res)=>{
    const {email,username,password,role} = req.body

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or name already exist")
    }

    const user = new User({
        email,
        password,
        username,
        isEmailVerified:false
    })

    const {unHashedToken,HashedToken,tokenExpiry}=user.generateTemporaryToken()

    user.emailVerficationToken = HashedToken
    user.emailVerficationExpiry = tokenExpiry

    await user.save({validateBeforeSave:false})


    await sendMail({
        email: user?.email,
        subject:"Please verify your email",
        mailgenContent:emailVerificationMailGenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    })

    const createdUser= await User.findById(user._id).select("-password -refreshToken -emailVerficationToken -emailVerficationExpiry")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registreing the user")
    }

    return res.status(201).json(new ApiResponse(200,{user: createdUser},"User registered succesfully and verification sent to your email"))
})

module.exports=registerUser