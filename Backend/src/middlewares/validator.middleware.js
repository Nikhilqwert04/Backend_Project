const {validationResult} = require("express-validator")
const ApiError = require("../utils/api-error.js")


const validate = (req,res,next)=>{
    const error=validationResult(req)

    if(error.isEmpty()){
        return next()
    }
    const extractedErrors =[]
    error.array().map((err)=>extractedErrors.push({
        [err.path]:err.msg
    }))

    throw new ApiError(422,"Recieved data is not valid",extractedErrors)
}

module.exports=validate
