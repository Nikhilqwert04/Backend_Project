const asyncHandler = (requestHandlers)=>{
    return(req,res,next)=>{
        Promise
        .resolve(requestHandlers(req,res,next))
        .catch((err)=>next(err))
    }
}

export default asyncHandler;