import express from "express";
import validateAdmin from "../middleware/validateAdmin.js"
import upload from "../config/multerConfig.js";
import { getVideoCard, createVideoCard, deleteVideoCard, IndividualVideoCard, limitVideoCard, updateVideoCard, uploadVideo } from "../controllers/contentController.js";

const router = express.Router();

router.get("/", getVideoCard)
router.get("/:id", IndividualVideoCard)
router.get("/limit/:limit", limitVideoCard)
router.post("/", validateAdmin, createVideoCard)
router.post('/video-upload', validateAdmin, upload.single('video'), uploadVideo)
router.put("/:id", validateAdmin, updateVideoCard)
router.delete("/:id", validateAdmin, deleteVideoCard)

export default router; 