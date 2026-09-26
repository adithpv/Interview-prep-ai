import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { HttpStatus } from "../utils/httpStatus";
import { assertFieldsExist, assertArray } from "../utils/appAssert";
import { sendResponse } from "../utils/responseHandler";
import { AuthenticatedRequest } from "../types";
import { BadRequestException } from "../utils/AppError";
import {
    addQuestionsToSessionService,
    togglePinQuestionService,
    updateQuestionNoteService,
    updateQuestionStatusService,
} from "../services/questionService";

export const addQuestionsToSession = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const { sessionId, questions } = req.body;
        const userId = req.user._id;

        assertFieldsExist({ sessionId, questions });
        assertArray(questions, "Questions");

        const result = await addQuestionsToSessionService({
            sessionId,
            questions,
            userId: userId.toString(),
        });

        sendResponse({ res, statusCode: HttpStatus.CREATED, data: result });
    }
);

export const togglePinQuestion = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const questionId = req.params.id;
        const userId = req.user._id;
        assertFieldsExist({ questionId });

        const result = await togglePinQuestionService({
            questionId,
            userId: userId.toString(),
        });

        sendResponse({ res, statusCode: HttpStatus.OK, data: result });
    }
);

export const updateQuestionNote = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const questionId = req.params.id;
        const { note } = req.body;
        const userId = req.user._id;

        assertFieldsExist({ questionId, note });

        const result = await updateQuestionNoteService({
            questionId,
            note,
            userId: userId.toString(),
        });

        sendResponse({ res, statusCode: HttpStatus.OK, data: result });
    }
);

export const updateQuestionStatus = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const questionId = req.params.id;
        const { status } = req.body;
        const userId = req.user._id;

        assertFieldsExist({ questionId, status });
        
        if (status !== 'learning' && status !== 'mastered') {
            throw new BadRequestException("Status must be either 'learning' or 'mastered'");
        }

        const result = await updateQuestionStatusService({
            questionId,
            status,
            userId: userId.toString(),
        });

        sendResponse({ res, statusCode: HttpStatus.OK, data: result });
    }
);
