import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
    addQuestionsToSession,
    togglePinQuestion,
    updateQuestionNote,
    updateQuestionStatus,
    deleteQuestion,
} from "../controllers/questionController";

import { serverConfigs } from "../config/serverConfig";
import { validateRequest } from "../middlewares/validateRequest";
import { addQuestionsSchema, updateQuestionNoteSchema, updateQuestionStatusSchema } from "../schemas/questionSchemas";

const router = express.Router();

router.post("/add", protect, serverConfigs.generationLimiter, validateRequest(addQuestionsSchema), addQuestionsToSession);
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/note", protect, validateRequest(updateQuestionNoteSchema), updateQuestionNote);
router.patch("/:id/status", protect, validateRequest(updateQuestionStatusSchema), updateQuestionStatus);
router.delete("/:id", protect, deleteQuestion);

export default router;
