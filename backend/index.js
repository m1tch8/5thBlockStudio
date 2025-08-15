import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/userRoutes.js"
import errorHandler from "./middleware/errorHandler.js";
import connectDb from "./config/dbConnection.js";
import contentRoute from "./routes/contentRoutes.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDb();


const PORT = process.env.PORT || 5000;
const app = express();
app.use('/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use(cookieParser());
app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true 
}));
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/content", contentRoute)
app.use(errorHandler);


app.listen(PORT, () =>{
    console.log(`Server running on Port ${PORT}`);
});

