import { GoogleGenAI } from "@google/genai";
import { ENV } from "../utils/env";
import { GeneratedQAItem, QuestionAnswersPromptParams } from "../types";
import {
    conceptExplanationPrompt,
    questionAnswersPrompt,
} from "../utils/prompts";

let genAI: GoogleGenAI;

const initializeGenAI = async (): Promise<void> => {
    if (!genAI) {
        genAI = new GoogleGenAI({ apiKey: ENV.GOOGLE_API_KEY || "" });
    }
};

export const generateQuestionsService = async (
    params: QuestionAnswersPromptParams,
): Promise<GeneratedQAItem[]> => {
    await initializeGenAI();

    const { role, experience, topicsToFocus, numberOfQuestions } = params;

    const prompt = questionAnswersPrompt({
        role,
        experience,
        topicsToFocus,
        numberOfQuestions,
    });

    const response = await genAI.models.generateContent({
        model: ENV.GOOGLE_AI_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        },
    });

    const rawText = response.text;
    if (!rawText) {
        throw new Error("No response text received from AI model");
    }
    
    // Gemini with responseMimeType usually returns raw JSON, but fallback cleanup just in case
    const cleanText = rawText
        .replace(/```(?:json)?\s*/g, "") // Remove Markdown Blocks globally
        .replace(/[\u0000-\u001F]+/g, " ") // Strip raw unescaped control chars that break JSON.parse
        .trim();

    const data = JSON.parse(cleanText);
    return data;
};

export const generateConceptExplanationsService = async (
    question: string,
): Promise<{ title: string; explanation: string }> => {
    await initializeGenAI();

    const prompt = conceptExplanationPrompt(question);

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        },
    });

    const rawText = response.text;
    if (!rawText) {
        throw new Error("No response text received from AI model");
    }

    const cleanText = rawText
        .replace(/```(?:json)?\s*/g, "") // Remove Markdown Blocks globally
        .replace(/[\u0000-\u001F]+/g, " ") // Strip raw unescaped control chars
        .trim();

    const data = JSON.parse(cleanText);
    return data;
};
