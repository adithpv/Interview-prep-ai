import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
    createSession,
    deleteSession,
    getMySessions,
    getSessionById,
    updateSession,
    resetSessionProgress,
} from "../controllers/sessionController";

import { validateRequest } from "../middlewares/validateRequest";
import { createSessionSchema, updateSessionSchema } from "../schemas/sessionSchemas";

const router = express.Router();

router.post("/create", protect, validateRequest(createSessionSchema), createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.patch("/:id", protect, validateRequest(updateSessionSchema), updateSession);
router.post("/:id/reset-progress", protect, resetSessionProgress);
router.delete("/:id", protect, deleteSession);

export default router;
