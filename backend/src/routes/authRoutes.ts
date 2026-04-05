import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    uploadImage,
    refreshTokenController,
    logoutUser,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import upload from "../middlewares/uploadMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../schemas/authSchemas";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/refresh", refreshTokenController);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);
router.post("/upload-image", upload.single("image"), uploadImage);

export default router;
