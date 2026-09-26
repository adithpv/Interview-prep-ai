import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
    addQuestionsToSession,
    togglePinQuestion,
    updateQuestionNote,
    updateQuestionStatus,
} from "../controllers/questionController";

import { serverConfigs } from "../config/serverConfig";

const router = express.Router();

router.post("/add", protect, serverConfigs.generationLimiter, addQuestionsToSession);
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/note", protect, updateQuestionNote);
router.patch("/:id/status", protect, updateQuestionStatus);

export default router;
