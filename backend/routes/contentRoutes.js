import express from "express";
import {contentPermission} from "../middleware/userAuth.js"
/* import { upload } from '../middleware/multerConfig.js'; */
import getVideoCard, { 
    createVideoCard,
    createVideoCardFile,
    deleteVideoCard,
    IndividualVideoCard,
    limitVideoCard,
    updateVideoCard,
    uploadVideo 
} from "../controllers/contentController.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", getVideoCard)
router.get("/:id", IndividualVideoCard)
router.get("/limit/:limit", limitVideoCard)
router.post("/", contentPermission, createVideoCard)
/* router.post('/upload-video', upload.single('video'), createVideoCardFile); */
router.post('/video-upload', upload.single('video'), uploadVideo)
router.put("/:id", updateVideoCard)
router.delete("/:id", contentPermission, deleteVideoCard)

export default router; 