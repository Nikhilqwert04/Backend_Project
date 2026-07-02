const ApiResponse = require("../utils/api-response.js");
const asyncHandler = require("../utils/async-handler.js")

// const healthCheck = (req, res) => {
//     try {
//         res.status(200).json(
//             new ApiResponse(200, {message: "Server is Running"})
//         );
//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }

const healthCheck = asyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,{message:"Server is Running"}))
})
module.exports = healthCheck;