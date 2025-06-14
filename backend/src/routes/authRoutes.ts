import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  uploadImage,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import upload from "../middlewares/uploadMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/upload-image", upload.single("image"), uploadImage);

export default router;
