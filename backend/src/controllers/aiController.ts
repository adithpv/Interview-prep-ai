import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { HttpStatus } from "../utils/httpStatus";
import { assertFieldsExist } from "../utils/appAssert";
import { GeneratedQAItem, QuestionAnswersPromptParams } from "../types";
import {
    generateQuestionsService,
    generateConceptExplanationsService,
} from "../services/aiService";

export const generateQuestions = catchAsync(
    async (
        req: Request<{}, {}, QuestionAnswersPromptParams>,
        res: Response<GeneratedQAItem[]>
    ) => {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
        assertFieldsExist({
            role,
            experience,
            topicsToFocus,
            numberOfQuestions,
        });

        const data = await generateQuestionsService({
            role,
            experience,
            topicsToFocus,
            numberOfQuestions,
        });

        res.status(HttpStatus.OK).json(data);
    }
);

export const generateConceptExplanations = catchAsync(
    async (req: Request, res: Response) => {
        const { question } = req.body;
        assertFieldsExist({ question });

        const data = await generateConceptExplanationsService(question);

        res.status(HttpStatus.OK).json(data);
    }
);
