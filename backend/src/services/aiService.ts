import { z } from "zod";
import { AIProvider, GeminiAdapter } from "../adapters/geminiAdapter";
import { GeneratedQAItem, QuestionAnswersPromptParams } from "../types";
import {
    conceptExplanationPrompt,
    questionAnswersPrompt,
} from "../utils/prompts";
import { InternalServerErrorException } from "../utils/AppError";

const aiProvider: AIProvider = new GeminiAdapter();

const GeneratedQAItemSchema = z.object({
    question: z.string(),
    answer: z.string(),
});

const GeneratedQAListSchema = z.array(GeneratedQAItemSchema);

const ConceptExplanationSchema = z.object({
    title: z.string(),
    explanation: z.string(),
});

export const generateQuestionsService = async (
    params: QuestionAnswersPromptParams,
): Promise<GeneratedQAItem[]> => {
    const { role, experience, topicsToFocus, numberOfQuestions } = params;

    const prompt = questionAnswersPrompt({
        role,
        experience,
        topicsToFocus,
        numberOfQuestions,
    });

    const cleanText = await aiProvider.generateContent(prompt);

    try {
        const data = JSON.parse(cleanText);
        const parsedData = GeneratedQAListSchema.parse(data);
        return parsedData;
    } catch (e) {
        console.error("Failed to parse AI response:", e);
        throw new InternalServerErrorException("Invalid response format from AI provider");
    }
};

import { ConceptCache } from "../models/conceptCacheModel";
import crypto from "crypto";

export const generateConceptExplanationsService = async (
    question: string,
): Promise<{ title: string; explanation: string }> => {
    const questionHash = crypto.createHash("sha256").update(question.trim()).digest("hex");

    // Check cache first
    const cached = await ConceptCache.findOne({ questionHash });
    if (cached) {
        try {
            return JSON.parse(cached.explanation);
        } catch (e) {
            // If cached data is somehow corrupted, fallback to generating
            console.error("Failed to parse cached explanation:", e);
        }
    }

    const prompt = conceptExplanationPrompt(question);

    const cleanText = await aiProvider.generateContent(prompt);

    let parsedData: { title: string; explanation: string };
    try {
        const data = JSON.parse(cleanText);
        parsedData = ConceptExplanationSchema.parse(data);
    } catch (e) {
        console.error("Failed to parse AI response:", e);
        throw new InternalServerErrorException("Invalid response format from AI provider");
    }

    try {
        // Save stringified parsed data to cache (best effort)
        await ConceptCache.updateOne(
            { questionHash },
            { $set: { question: question.trim(), explanation: JSON.stringify(parsedData) } },
            { upsert: true }
        );
    } catch (e) {
        console.error("Failed to write to cache:", e);
    }

    return parsedData;
};
