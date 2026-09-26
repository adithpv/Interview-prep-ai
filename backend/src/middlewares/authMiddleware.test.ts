import { describe, it, expect, vi, beforeEach } from 'vitest';
import { protect } from './authMiddleware';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../utils/AppError';

// Mock env
vi.mock('../utils/env', () => ({
    ENV: { JWT_SECRET: 'test-secret' }
}));

// Mock jwt
vi.mock('jsonwebtoken', () => ({
    default: {
        verify: vi.fn()
    }
}));

describe('Auth Middleware', () => {
    let mockReq: any;
    let mockRes: any;
    let mockNext: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockReq = { cookies: {} };
        mockRes = {};
        mockNext = vi.fn();
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
        // Protect is wrapped in catchAsync, which returns a (req, res, next) function
        // It catches errors and passes them to next(), or we can await it directly.
        // Wait, catchAsync catches errors and calls next(err).
        
        await protect(mockReq, mockRes, mockNext);
        
        expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException));
        expect(mockNext.mock.calls[0][0].message).toBe("Not authorized, no token provided");
    });

    it('should throw UnauthorizedException if token payload is invalid', async () => {
        mockReq.cookies.accessToken = 'invalid-token';
        (jwt.verify as any).mockReturnValue({}); // Missing id

        await protect(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedException));
        expect(mockNext.mock.calls[0][0].message).toBe("Invalid token payload");
    });

    it('should assign user and call next if token is valid', async () => {
        mockReq.cookies.accessToken = 'valid-token';
        (jwt.verify as any).mockReturnValue({ id: 'user-123' });

        await protect(mockReq, mockRes, mockNext);

        expect(mockReq.user).toEqual({ _id: 'user-123' });
        expect(mockNext).toHaveBeenCalledWith(); // called without errors
    });
});
