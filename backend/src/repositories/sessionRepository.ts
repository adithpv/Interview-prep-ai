import mongoose from "mongoose";
import { Session, ISession } from "../models/sessionModel";
import { Question } from "../models/questionModel";

export const sessionRepository = {
    async createSessionWithQuestions(
        sessionData: Partial<ISession>,
        questions: Array<{ question: string; answer: string }>
    ) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const [newSession] = await Session.create([sessionData], { session });

            const questionDocs = questions.map((q) => ({
                user: sessionData.user,
                session: newSession._id,
                question: q.question,
                answer: q.answer,
            }));

            const createdQuestions = await Question.insertMany(questionDocs, { session });

            newSession.questions = createdQuestions.map((q) => q._id as any);
            await newSession.save({ session });

            await session.commitTransaction();
            return newSession;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    },

    async deleteSessionAndQuestions(sessionId: string) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Question.deleteMany({ session: sessionId }).session(session);
            await Session.deleteOne({ _id: sessionId }).session(session);
            
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
};
