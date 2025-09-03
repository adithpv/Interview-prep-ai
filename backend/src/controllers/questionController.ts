import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { HttpStatus } from "../utils/httpStatus";
import { assertFieldsExist, assertArray } from "../utils/appAssert";
import { AuthenticatedRequest } from "../types";
import {
    addQuestionsToSessionService,
    togglePinQuestionService,
    updateQuestionNoteService,
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

        res.status(HttpStatus.CREATED).json(result);
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

        res.status(HttpStatus.OK).json(result);
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

        res.status(HttpStatus.OK).json(result);
    }
);
