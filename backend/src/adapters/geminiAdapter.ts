import { GoogleGenAI } from "@google/genai";
import { ENV } from "../utils/env";
import { ServiceUnavailableException } from "../utils/AppError";

export interface AIProvider {
    generateContent(prompt: string): Promise<string>;
}

export class GeminiAdapter implements AIProvider {
    private genAI: GoogleGenAI;

    constructor() {
        this.genAI = new GoogleGenAI({ apiKey: ENV.GOOGLE_API_KEY || "" });
    }

    async generateContent(prompt: string): Promise<string> {
        const MAX_RETRIES = 3;
        let lastError: any = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const response = await this.genAI.models.generateContent({
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

                return rawText
                    .replace(/```(?:json)?\s*/g, "")
                    .replace(/[\u0000-\u001F]+/g, " ")
                    .trim();
            } catch (error: any) {
                console.error(`AI Provider Error (Attempt ${attempt}/${MAX_RETRIES}):`, error?.message || error);
                lastError = error;
                
                // If it's a 503 or 429, wait before retrying
                if (error?.message?.includes("503") || error?.message?.includes("429")) {
                    if (attempt < MAX_RETRIES) {
                        const backoff = Math.pow(2, attempt) * 1000;
                        await new Promise((resolve) => setTimeout(resolve, backoff));
                        continue;
                    }
                }
                
                // For other errors, or if max retries reached
                break;
            }
        }

        throw new ServiceUnavailableException(
            "AI generation is currently experiencing high demand. Please try again later."
        );
    }
}
