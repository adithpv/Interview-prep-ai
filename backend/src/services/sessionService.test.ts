import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Session } from '../models/sessionModel';
import { Question } from '../models/questionModel';
import { sessionRepository } from '../repositories/sessionRepository';
import {
    createSessionService,
    getMySessionsService,
    getSessionByIdService,
    updateSessionService,
    deleteSessionService,
    resetSessionProgressService,
} from './sessionService';

vi.mock('../models/sessionModel');
vi.mock('../models/questionModel');
vi.mock('../repositories/sessionRepository');
vi.mock('../utils/appAssert', () => ({
    assertNotFound: (doc: any, name: string) => {
        if (!doc) throw new Error(`${name} not found`);
    },
    assertAuth: (condition: boolean, msg: string) => {
        if (!condition) throw new Error(`Not authorized to ${msg}`);
    },
}));

describe('sessionService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createSessionService', () => {
        it('should call repository to create session with questions', async () => {
            const mockSession = { _id: 's1', role: 'Frontend Engineer' };
            vi.mocked(sessionRepository.createSessionWithQuestions).mockResolvedValue(mockSession as any);

            const result = await createSessionService({
                userId: 'user1',
                role: 'Frontend Engineer',
                experience: '3',
                topicsToFocus: 'React',
                description: 'Mock session',
                questions: [{ question: 'Q1', answer: 'A1' }],
            });

            expect(sessionRepository.createSessionWithQuestions).toHaveBeenCalledWith(
                {
                    user: 'user1',
                    role: 'Frontend Engineer',
                    experience: '3',
                    topicsToFocus: 'React',
                    description: 'Mock session',
                },
                [{ question: 'Q1', answer: 'A1' }]
            );
            expect(result).toEqual({ success: true, session: mockSession });
        });
    });

    describe('getSessionByIdService', () => {
        it('should return session if authorized', async () => {
            const mockSession = { _id: 's1', user: { toString: () => 'user1' } };
            const queryMock = {
                populate: vi.fn().mockReturnThis(),
                exec: vi.fn().mockResolvedValue(mockSession),
            };
            vi.mocked(Session.findById).mockReturnValue(queryMock as any);

            const result = await getSessionByIdService({ sessionId: 's1', userId: 'user1' });
            expect(result.session).toEqual(mockSession);
        });

        it('should throw if user is not authorized (IDOR guard)', async () => {
            const mockSession = { _id: 's1', user: { toString: () => 'user1' } };
            const queryMock = {
                populate: vi.fn().mockReturnThis(),
                exec: vi.fn().mockResolvedValue(mockSession),
            };
            vi.mocked(Session.findById).mockReturnValue(queryMock as any);

            await expect(
                getSessionByIdService({ sessionId: 's1', userId: 'attacker' })
            ).rejects.toThrow('Not authorized');
        });
    });

    describe('resetSessionProgressService', () => {
        it('should reset mastered questions to learning for authorized owner', async () => {
            const mockSession = { _id: 's1', user: { toString: () => 'user1' } };
            vi.mocked(Session.findById).mockResolvedValue(mockSession as any);
            vi.mocked(Question.updateMany).mockResolvedValue({ acknowledged: true } as any);

            const result = await resetSessionProgressService({ sessionId: 's1', userId: 'user1' });
            expect(Question.updateMany).toHaveBeenCalledWith(
                { session: 's1', user: 'user1', status: 'mastered' },
                { $set: { status: 'learning' } }
            );
            expect(result.success).toBe(true);
        });
    });
});
