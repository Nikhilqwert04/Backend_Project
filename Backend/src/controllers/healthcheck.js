const ApiResponse = require("../utils/api-response.js");
const asyncHandler = require("../utils/async-handler.js")

const healthCheck = asyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,{message:"Server is Running"}))
})
module.exports = healthCheck;