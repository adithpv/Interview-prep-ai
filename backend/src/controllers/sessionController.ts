import { Response } from "express";
import { HttpStatus } from "../utils/httpStatus";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../types";
import { assertFieldsExist } from "../utils/appAssert";
import { sendResponse } from "../utils/responseHandler";
import {
    createSessionService,
    getMySessionsService,
    getSessionByIdService,
    deleteSessionService,
} from "../services/sessionService";

export const createSession = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const { role, experience, topicsToFocus, description, questions } =
            req.body;
        const userId = req.user._id;
        assertFieldsExist({ userId });

        const result = await createSessionService({
            role,
            experience,
            topicsToFocus,
            description,
            questions,
            userId: userId.toString(),
        });

        sendResponse({ res, statusCode: HttpStatus.CREATED, data: result });
    }
);

export const getMySessions = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user._id;
        assertFieldsExist({ userId });

        const sessions = await getMySessionsService(userId.toString());

        sendResponse({ res, statusCode: HttpStatus.OK, data: sessions });
    }
);

export const getSessionById = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const sessionId = req.params.id;
        assertFieldsExist({ sessionId });

        const result = await getSessionByIdService({ sessionId });

        sendResponse({ res, statusCode: HttpStatus.OK, data: result });
    }
);

export const deleteSession = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const sessionId = req.params.id;
        const userId = req.user._id;

        assertFieldsExist({ sessionId });

        const result = await deleteSessionService({
            sessionId,
            userId: userId.toString(),
        });

        sendResponse({ res, statusCode: HttpStatus.OK, data: result });
    }
);
