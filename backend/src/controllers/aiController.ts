import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { HttpStatus } from "../utils/httpStatus";
import { assertFieldsExist } from "../utils/appAssert";
import {
  conceptExplanationPrompt,
  questionAnswersPrompt,
} from "../utils/prompts";
import { ENV } from "../utils/env";
import { GeneratedQAItem, QuestionAnswersPromptParams } from "../types";

let genAI: any;

const initializeGenAI = async () => {
  const { GoogleGenAI, GenerateContentResponse } = await import(
    "@google/genai"
  );
  genAI = new GoogleGenAI({ apiKey: ENV.GOOGLE_API_KEY || "" });
};

export const generateQuestions = catchAsync(
  async (
    req: Request<{}, {}, QuestionAnswersPromptParams>,
    res: Response<GeneratedQAItem[]>
  ) => {
    if (!genAI) {
      await initializeGenAI();
    }
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
    assertFieldsExist({ role, experience, topicsToFocus, numberOfQuestions });

    const prompt = questionAnswersPrompt({
      role,
      experience,
      topicsToFocus,
      numberOfQuestions,
    });

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text;

    const cleanText = rawText
      .replace(/^```json\s*/, "") // Remove starting ```json
      .replace(/```$/, "") // Remove ending ```
      .trim(); // Trim whitespace

    const data = JSON.parse(cleanText);
    res.status(HttpStatus.OK).json(data);
  }
);

export const generateConceptExplanations = catchAsync(
  async (req: Request, res: Response) => {
    const { question } = req.body;
    assertFieldsExist({ question });

    if (!genAI) {
      await initializeGenAI();
    }

    const prompt = conceptExplanationPrompt(question);

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text;

    const cleanText = rawText
      .replace(/^```json\s*/, "") // Remove starting ```json
      .replace(/```$/, "") // Remove ending ```
      .trim(); // Trim whitespace

    const data = JSON.parse(cleanText);
    res.status(HttpStatus.OK).json(data);
  }
);
