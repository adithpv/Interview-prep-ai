import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
    createSession,
    deleteSession,
    getMySessions,
    getSessionById,
    updateSession,
} from "../controllers/sessionController";

const router = express.Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.patch("/:id", protect, updateSession);
router.delete("/:id", protect, deleteSession);

export default router;
