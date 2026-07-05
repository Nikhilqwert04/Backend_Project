const User = require("../models/student.model.js")
const ApiError = require("../utils/api-error.js")
const asyncHandler  = require("../utils/async-handler.js")
const jwt = require("jsonwebtoken")


const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unothrized token")
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerficationExpiry -emailVerficationToken")
        if (!user) {
            throw new ApiError(401, "Invalid access Token")
        }
        req.user=user
        next()
    }
    catch(err){
        throw new ApiError(401, err?.message || "Invalid access token")
    }
    
})

module.exports = verifyJWT


