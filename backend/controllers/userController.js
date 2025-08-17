import asyncHandler from "express-async-handler"
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//GET
//Gets all the USERS data
const getUser = asyncHandler(async (req,res) =>{
    const user = await User.find();
    res.json(user)
})

//GET
//Gets current logged User 
export const currentUser = asyncHandler(async (req,res)=>{
    const id = req.user.id
    const user = await User.findById(id).select('id username email role')
    res.status(200).json(user);
})

//POST
//Register User
export const registerUser = asyncHandler(async (req,res) =>{
    const {username, email, password, role} = req.body;
    if(!username ||!email||!password){
        res.status(400)
        throw new Error("All fields are required");
    }
    
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });
        res.status(200).json(newUser);
    }
    catch(err){
        res.status(500)
        throw new Error(err.message);
    }
})

//POST 
//Login User
export const loginUser = asyncHandler(async (req,res) =>{
    const {email, username, password} = req.body;
    let user;
    if (!email && !username){
        res.status(400);
        throw new Error("All fields are required");
    }
    if (!password){
        res.status(400);
        throw new Error("All fields are required")
    }

    if(username){
        user = await User.findOne({username});
    }
    else{
        user = await User.findOne({email});
    }
    
    if(!user){
        res.status(404);
        throw new Error("Invalid username or password")
    }
    //Matching passwords
    if(user && await (bcrypt.compare(password, user.password))){

        try{
            //Generate Access Token
            const accessToken = jwt.sign({
                user:{
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    role: user.role
                }
            },process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'});

            //Generate Refresh Token
            const refreshToken = jwt.sign({
                user:{
                    username: user.username,
                    email: user.email,
                    id: user.id,
                    role: user.role
                }
            },process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});

            /* RefreshTokens.create({
                token: refreshToken
            }); */

            //Adds Refresh Token to Cookie
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.status(200).json({
                accessToken,
                role: user.role
            });
        }
        catch(err){
            res.status(500)
            throw new Error(err.message)
        }
    }
    else{
        res.status(404);
        throw new Error("Invalid username or password");
    }
    
})

//GET
//Renew Token
export const refresh = asyncHandler(async(req, res) =>{
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        res.status(401);
        throw new Error("Unauthorized");
    }

    const refreshToken = cookies.jwt;
    let newAccessToken;
    let role;
    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        newAccessToken = jwt.sign({
            user: decoded.user,
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m' })
        role = decoded.user.role;
    }
    catch (err){
        res.status(500)
        throw new Error(err.message);
    }

    res.status(200).json({
        accessToken: newAccessToken,
        role
    });
});

//GET
//Logout User
export const logoutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt){
        return res.status(204).json({message: "No Content"})
    }

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: process.env.NODE_ENV === production
    });
    
    
    res.json({message: "Successfuly logged out"});
    
});

export const changePassword = asyncHandler(async (req, res) => {
    const userValues = req.user
    const {oldPassword, newPassword} = req.body
    
    const user = await User.findById(userValues.id)

    if(user && await (bcrypt.compare(oldPassword, user.password))){
        
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
    }
    else{
        res.status(400)
        throw new Error("Old Password do not match")
    }
    
    user.save();

    res.status(200).json({message: "Password successfully changed"})
})

export const updateUser = asyncHandler(async (req, res) => {
    const userDetails = req.user;
    const {email, username} = req.body

    if (!email || !username){
        res.status(400);
        throw new Error("All fields are required")
    }

    const user = await User.findByIdAndUpdate(userDetails.id,{
            email,
            username
        },
        { new: true }
    );
    const refreshToken = jwt.sign({
        user:{
            username: user.username,
            email: user.email,
            id: user.id,
            role: user.role
        }
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'});

    //Adds Refresh Token to Cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === production ,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    
    res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    })
    
    
})

//Delete
export const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id
    
    const userDeleted = await User.findByIdAndDelete(id);

    res.status(200).json(userDeleted)
    
})


export default getUser;