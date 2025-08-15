import express from "express";
import userRoute from "./routes/userRoutes.js"
import errorHandler from "./middleware/errorHandler.js";
import connectDb from "./config/dbConnection.js";
import contentRoute from "./routes/contentRoutes.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __dirname2 = path.resolve()

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

console.log('dirname2', __dirname2)
console.log('dirname', __dirname)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname2, "frontend/dist")))

    app.all("/{*any}", (req,res)=>{
        res.sendFile(path.resolve(__dirname2, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, () =>{
    console.log(`Server running on Port ${PORT}`);
});

