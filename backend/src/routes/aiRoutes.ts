import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { serverConfigs } from "../config/serverConfig";
import { validateRequest } from "../middlewares/validateRequest";
import { generateQuestionsSchema, generateExplanationSchema } from "../schemas/aiSchemas";
import { generateQuestions, generateConceptExplanations } from "../controllers/aiController";

const router = express.Router();

router.post("/generate-questions", protect, serverConfigs.generationLimiter, validateRequest(generateQuestionsSchema), generateQuestions);
router.post("/generate-explanation", protect, serverConfigs.generationLimiter, validateRequest(generateExplanationSchema), generateConceptExplanations);

export default router;
