import express from "express";
import {contentPermission} from "../middleware/userAuth.js"
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
router.post('/video-upload', contentPermission, upload.single('video'), uploadVideo)
router.put("/:id", contentPermission, updateVideoCard)
router.delete("/:id", contentPermission, deleteVideoCard)

export default router; 