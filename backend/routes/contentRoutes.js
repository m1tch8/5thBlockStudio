import express from "express";
import {contentPermission} from "../middleware/userAuth.js"
import { upload } from '../middleware/multerConfig.js';
import getVideoCard, { 
    createVideoCard,
    createVideoCardFile,
    deleteVideoCard,
    IndividualVideoCard,
    limitVideoCard,
    updateVideoCard 
} from "../controllers/contentController.js";

const router = express.Router();

router.get("/", getVideoCard)
router.get("/:id", IndividualVideoCard)
router.get("/limit/:limit", limitVideoCard)
router.post("/", contentPermission, createVideoCard)
router.post('/upload-video', upload.single('video'), createVideoCardFile);
router.put("/:id", updateVideoCard)
router.delete("/:id", contentPermission, deleteVideoCard)

export default router; 