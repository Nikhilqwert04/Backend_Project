import User from "../models/student.model.js";
import ApiError from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import jwt from "jsonwebtoken";


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

export default verifyJWT;


