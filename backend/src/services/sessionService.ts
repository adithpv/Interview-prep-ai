import { Session } from "../models/sessionModel";
import { Question } from "../models/questionModel";
import { assertNotFound, assertAuth } from "../utils/appAssert";

export interface CreateSessionParams {
    role: string;
    experience: string;
    topicsToFocus: string;
    description?: string;
    questions: Array<{
        question: string;
        answer: string;
    }>;
    userId: string;
}

export interface GetSessionByIdParams {
    sessionId: string;
}

export interface DeleteSessionParams {
    sessionId: string;
    userId: string;
}

export const createSessionService = async (
    params: CreateSessionParams
): Promise<{
    success: boolean;
    session: any;
}> => {
    const { role, experience, topicsToFocus, description, questions, userId } =
        params;

    const session = await Session.create({
        user: userId,
        role,
        experience,
        topicsToFocus,
        description,
    });

    const questionDocs = await Promise.all(
        questions.map(async (q) => {
            return await Question.create({
                user: userId,
                session: session._id,
                question: q.question,
                answer: q.answer,
            });
        })
    );

    session.questions = questionDocs.map((q) => q._id as any);
    await session.save();

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
    const { sessionId } = params;

    const session = await Session.findById(sessionId)
        .populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: -1 } },
        })
        .exec();

    assertNotFound(!!session, "Session");

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

    await Question.deleteMany({ session: session._id });
    await session.deleteOne();

    return {
        message: "Session deleted successfully",
    };
};
