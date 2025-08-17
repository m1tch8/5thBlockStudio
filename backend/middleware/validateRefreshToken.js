import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"

//REFRESH TOKEN VALIDATION
export const validateRefreshToken = asyncHandler(async(req, res, next)=> {
    const token = req.cookies.jwt
    if(!token){
        res.status(404);
        throw new Error("No Refresh Token Exist")
    }

    try{
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        req.user = decoded.user
    }
    catch(err){
        res.status(401);
        throw new Error("Token expired")
    }
    next();

})

export default validateRefreshToken;