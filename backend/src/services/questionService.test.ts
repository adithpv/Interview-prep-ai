import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Session } from '../models/sessionModel';
import { Question } from '../models/questionModel';
import {
    addQuestionsToSessionService,
    deleteQuestionService,
    togglePinQuestionService,
    updateQuestionStatusService
} from './questionService';
import mongoose from 'mongoose';

vi.mock('mongoose', async (importOriginal) => {
    const actual = await importOriginal<any>();
    return {
        ...actual,
        default: {
            ...actual.default,
            startSession: vi.fn()
        }
    };
});
vi.mock('../models/sessionModel');
vi.mock('../models/questionModel');
vi.mock('../utils/appAssert', () => {
    return {
        assertAuth: (condition: boolean, msg: string) => {
            if (!condition) {
                throw new Error(`Not authorized to ${msg}`);
            }
        },
        assertNotFound: (doc: any, msg: string) => {
            if (!doc) {
                throw new Error(`${msg} not found`);
            }
        },
        assertArray: vi.fn()
    };
});

describe('questionService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addQuestionsToSessionService', () => {
        it('should successfully add questions and commit transaction', async () => {
            const mockSession = {
                _id: 'session1',
                user: { toString: () => 'user1' },
                questions: [],
                save: vi.fn().mockResolvedValue(true)
            };
            
            const mockMongooseSession = {
                startTransaction: vi.fn(),
                commitTransaction: vi.fn(),
                abortTransaction: vi.fn(),
                endSession: vi.fn()
            };

            vi.mocked(Session.findById).mockResolvedValue(mockSession as any);
            vi.mocked(mongoose.startSession).mockResolvedValue(mockMongooseSession as any);
            
            vi.mocked(Question.insertMany).mockResolvedValue([
                { _id: 'q1', question: 'Q1' },
                { _id: 'q2', question: 'Q2' }
            ] as any);

            const result = await addQuestionsToSessionService({
                sessionId: 'session1',
                userId: 'user1',
                questions: [{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }]
            });

            expect(mongoose.startSession).toHaveBeenCalled();
            expect(mockMongooseSession.startTransaction).toHaveBeenCalled();
            expect(Question.insertMany).toHaveBeenCalled();
            expect(mockSession.questions).toEqual(['q1', 'q2']);
            expect(mockSession.save).toHaveBeenCalled();
            expect(mockMongooseSession.commitTransaction).toHaveBeenCalled();
            expect(mockMongooseSession.endSession).toHaveBeenCalled();
            expect(result.questions).toHaveLength(2);
        });

        it('should rollback transaction on error and end session', async () => {
            const mockSession = {
                _id: 'session1',
                user: { toString: () => 'user1' }
            };
            
            const mockMongooseSession = {
                startTransaction: vi.fn(),
                commitTransaction: vi.fn(),
                abortTransaction: vi.fn(),
                endSession: vi.fn()
            };

            vi.mocked(Session.findById).mockResolvedValue(mockSession as any);
            vi.mocked(mongoose.startSession).mockResolvedValue(mockMongooseSession as any);
            
            vi.mocked(Question.insertMany).mockRejectedValue(new Error('DB Error'));

            await expect(addQuestionsToSessionService({
                sessionId: 'session1',
                userId: 'user1',
                questions: [{ question: 'Q1', answer: 'A1' }]
            })).rejects.toThrow('DB Error');

            expect(mockMongooseSession.abortTransaction).toHaveBeenCalled();
            expect(mockMongooseSession.endSession).toHaveBeenCalled();
            expect(mockMongooseSession.commitTransaction).not.toHaveBeenCalled();
        });

        it('should throw ForbiddenException if user does not own session', async () => {
            const mockSession = {
                _id: 'session1',
                user: { toString: () => 'user2' }
            };

            vi.mocked(Session.findById).mockResolvedValue(mockSession as any);

            await expect(addQuestionsToSessionService({
                sessionId: 'session1',
                userId: 'user1',
                questions: [{ question: 'Q1', answer: 'A1' }]
            })).rejects.toThrow('Not authorized');
        });
    });

    describe('deleteQuestionService', () => {
        it('should cleanly pull from session and delete question', async () => {
            const mockQuestion = {
                _id: 'q1',
                session: 'session1',
                user: { toString: () => 'user1' },
                deleteOne: vi.fn().mockResolvedValue(true)
            };

            vi.mocked(Question.findById).mockResolvedValue(mockQuestion as any);
            vi.mocked(Session.updateOne).mockResolvedValue({} as any);

            await deleteQuestionService({ questionId: 'q1', userId: 'user1' });

            expect(Session.updateOne).toHaveBeenCalledWith(
                { _id: 'session1' },
                { $pull: { questions: 'q1' } }
            );
            expect(mockQuestion.deleteOne).toHaveBeenCalled();
        });

        it('should enforce IDOR when deleting question', async () => {
            const mockQuestion = {
                _id: 'q1',
                user: { toString: () => 'user2' }
            };

            vi.mocked(Question.findById).mockResolvedValue(mockQuestion as any);

            await expect(deleteQuestionService({
                questionId: 'q1',
                userId: 'user1'
            })).rejects.toThrow('Not authorized');
        });
    });
});
