import { Question } from "../models/questionModel";
import { Session } from "../models/sessionModel";
import { assertNotFound, assertAuth, assertArray } from "../utils/appAssert";

export interface QuestionData {
    question: string;
    answer: string;
}

export interface AddQuestionsToSessionParams {
    sessionId: string;
    questions: QuestionData[];
    userId: string;
}

export interface TogglePinQuestionParams {
    questionId: string;
    userId: string;
}

export interface UpdateQuestionNoteParams {
    questionId: string;
    note: string;
    userId: string;
}

export const addQuestionsToSessionService = async (
    params: AddQuestionsToSessionParams
): Promise<{
    message: string;
    questions: any[];
}> => {
    const { sessionId, questions, userId } = params;

    const session = await Session.findById(sessionId);
    assertNotFound(session, "Session");

    assertAuth(
        session.user.toString() === userId.toString(),
        "Not authorized to add questions to this session"
    );

    const createdQuestions = await Question.insertMany(
        questions.map((q: QuestionData) => ({
            question: q.question,
            session: sessionId,
            answer: q.answer,
            user: userId,
        }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id as any));
    await session.save();

    return {
        message: `${createdQuestions.length} questions added`,
        questions: createdQuestions,
    };
};

export const togglePinQuestionService = async (
    params: TogglePinQuestionParams
): Promise<{
    message: string;
    question: any;
}> => {
    const { questionId, userId } = params;

    const question = await Question.findById(questionId);
    assertNotFound(question, "Question");

    assertAuth(
        question.user.toString() === userId.toString(),
        "Not authorized to update this question"
    );

    question.isPinned = !question.isPinned;
    await question.save();

    return {
        message: `Question ${question.isPinned ? "pinned" : "unpinned"} successfully`,
        question,
    };
};

export const updateQuestionNoteService = async (
    params: UpdateQuestionNoteParams
): Promise<{
    message: string;
    question: any;
}> => {
    const { questionId, note, userId } = params;

    const question = await Question.findById(questionId);
    assertNotFound(question, "Question");

    assertAuth(
        question.user.toString() === userId.toString(),
        "Not authorized to update this question"
    );

    question.note = note || "";
    await question.save();

    return {
        message: "Note updated successfully",
        question,
    };
};
