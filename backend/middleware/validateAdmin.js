import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const validateAdmin = asyncHandler(async (req, res, next)=>{
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
        if(decoded.user.role !== "admin"){
            throw new Error("User is not authorized");
        }
    }
    catch(error){
        res.status(401)
        throw new Error("User is not authorized");
    }

    next();
})

export default validateAdmin