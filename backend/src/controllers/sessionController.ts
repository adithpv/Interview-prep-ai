import { Response } from "express";
import { HttpStatus } from "../utils/httpStatus";
import { catchAsync } from "../utils/catchAsync";
import { AuthenticatedRequest } from "../types";
import { assertFieldsExist } from "../utils/appAssert";
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

        res.status(HttpStatus.CREATED).json(result);
    }
);

export const getMySessions = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user._id;
        assertFieldsExist({ userId });

        const sessions = await getMySessionsService(userId.toString());

        res.status(HttpStatus.OK).json(sessions);
    }
);

export const getSessionById = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const sessionId = req.params.id;
        assertFieldsExist({ sessionId });

        const result = await getSessionByIdService({ sessionId });

        res.status(HttpStatus.OK).json(result);
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

        res.status(HttpStatus.OK).json(result);
    }
);
