import { Session } from "../models/sessionModel";
import { User } from "../models/userModel";
import { Question } from "../models/questionModel";
import { assertNotFound, assertAuth } from "../utils/appAssert";
import { sessionRepository } from "../repositories/sessionRepository";
import {
    CreateSessionParams,
    GetSessionByIdParams,
    DeleteSessionParams,
} from "../types";

export const createSessionService = async (
    params: CreateSessionParams
): Promise<{
    success: boolean;
    session: any;
}> => {
    const { role, experience, topicsToFocus, description, questions, userId } =
        params;

    const session = await sessionRepository.createSessionWithQuestions(
        {
            user: userId as any,
            role,
            experience,
            topicsToFocus,
            description,
        },
        questions
    );

    return {
        success: true,
        session,
    };
};

export const getMySessionsService = async (userId: string): Promise<any[]> => {
    const sessions = await Session.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("questions");

    return sessions;
};

export const getSessionByIdService = async (
    params: GetSessionByIdParams
): Promise<{
    success: boolean;
    session: any;
}> => {
    const { sessionId, userId } = params;

    const session = await Session.findById(sessionId)
        .populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: -1 } },
        })
        .exec();

    assertNotFound(!!session, "Session");

    assertAuth(
        session!.user.toString() === userId.toString(),
        "Not authorized to view this session"
    );

    return {
        success: true,
        session,
    };
};

export const updateSessionService = async (
    params: import("../types").UpdateSessionParams
): Promise<{
    success: boolean;
    session: any;
}> => {
    const { sessionId, userId, role, experience, topicsToFocus, description } = params;

    const session = await Session.findById(sessionId);
    assertNotFound(session, "Session");

    assertAuth(
        session.user.toString() === userId.toString(),
        "Not authorized to edit this session"
    );

    if (role !== undefined) session.role = role;
    if (experience !== undefined) session.experience = experience;
    if (topicsToFocus !== undefined) session.topicsToFocus = topicsToFocus;
    if (description !== undefined) session.description = description;

    await session.save();

    return {
        success: true,
        session,
    };
};

export const deleteSessionService = async (
    params: DeleteSessionParams
): Promise<{
    message: string;
}> => {
    const { sessionId, userId } = params;

    const session = await Session.findById(sessionId);
    assertNotFound(session, "Session");

    assertAuth(
        session.user.toString() === userId.toString(),
        "Not authorized to delete this session"
    );

    await sessionRepository.deleteSessionAndQuestions(sessionId);

    return {
        message: "Session deleted successfully",
    };
};

export const resetSessionProgressService = async (
    params: { sessionId: string; userId: string }
): Promise<{ success: boolean; message: string }> => {
    const { sessionId, userId } = params;

    const session = await Session.findById(sessionId);
    assertNotFound(session, "Session");

    assertAuth(session.user.toString() === userId, "reset this session's progress");

    await Question.updateMany(
        { session: sessionId, user: userId, status: 'mastered' },
        { $set: { status: 'learning' } }
    );

    return { success: true, message: "Session progress reset successfully" };
};
