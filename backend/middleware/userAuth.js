import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import RefreshTokens from "../models/refreshTokenModel.js";
import TokenBlacklist from "../models/tokenBlacklistModel.js";

//ACCESS TOKEN VALIDATION
const validateToken = asyncHandler(async (req, res, next)=>{
    let authHeader = req.headers.Authorization || req.headers.authorization;

    //Checking if there is a Bearer Token
    if(!authHeader || !authHeader.startsWith("Bearer")){
        res.status(401);
        throw new Error("User is not authorized or token is missing")
    }

    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        req.user = decoded.user;
        next();
    }
    catch(error){
        res.status(401);
        throw new Error("User is not authorized");
    }
})

//REFRESH TOKEN VALIDATION
export const validateRefreshToken = asyncHandler(async(req, res, next)=> {
    const token = req.cookies.jwt;
    if(!token){
        res.status(404);
        throw new Error("No Refresh Token Exist")
    }

    try{
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        req.user = decoded.user
    }
    catch(err){
        res.status(401);
        throw new Error("Token expired");
    }
    next();

})

export const contentPermission = asyncHandler(async (req, res, next)=>{
    let authHeader = req.headers.Authorization || req.headers.authorization;

    //Checking if there is a Bearer Token
    if(!authHeader || !authHeader.startsWith("Bearer")){
        res.status(401);
        throw new Error("User is not authorized or token is missing")
    }

    const token = authHeader.split(" ")[1];

    //Checking if the token is in Blacklist
    const isTokenInBlacklist = await TokenBlacklist.findOne({token})
    if(isTokenInBlacklist){
        res.status(401);
        throw new Error("Token expired")
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user;
        if(decoded.user.role !== "admin"){
            throw new Error("User is not authorized");
        }
    }
    catch(error){
        res.status(401);
        throw new Error("User is not authorized");
    }

    next();
})

export default validateToken;