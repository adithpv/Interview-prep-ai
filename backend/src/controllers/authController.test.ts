import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser, logoutUser, refreshTokenController } from './authController';
import * as authService from '../services/authService';
import { UserSession } from '../models/userSessionModel';
import jwt from 'jsonwebtoken';

// Mock env
vi.mock('../utils/env', () => ({
    ENV: { 
        NODE_ENV: 'development',
        JWT_SECRET: 'test-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
    }
}));

// Mock services
vi.mock('../services/authService', () => ({
    registerUserService: vi.fn(),
    loginUserService: vi.fn(),
    getUserProfileService: vi.fn(),
    uploadImageService: vi.fn(),
    hashToken: vi.fn(),
    createAuthSession: vi.fn(),
}));

// Mock UserSession model
vi.mock('../models/userSessionModel', () => ({
    UserSession: {
        findOne: vi.fn(),
        findOneAndDelete: vi.fn(),
        deleteMany: vi.fn(),
        deleteOne: vi.fn(),
    }
}));

describe('Auth Controller', () => {
    let mockReq: any;
    let mockRes: any;
    let mockNext: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockReq = {
            body: {},
            cookies: {},
            headers: { 'user-agent': 'test-agent' },
            ip: '127.0.0.1'
        };
        mockRes = {
            cookie: vi.fn().mockReturnThis(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        mockNext = vi.fn();
    });

    it('registerUser should call registerUserService and set cookies', async () => {
        const mockResult = { 
            id: 'u1', 
            email: 'test@test.com',
            name: 'Test',
            profileImageUrl: '',
            message: 'User registered',
            accessToken: 'acc-token', 
            refreshToken: 'ref-token' 
        };
        vi.mocked(authService.registerUserService).mockResolvedValue(mockResult as any);

        mockReq.body = { name: 'Test', email: 'test@test.com', password: 'pass' };

        await registerUser(mockReq, mockRes, mockNext);

        expect(authService.registerUserService).toHaveBeenCalledWith({
            email: 'test@test.com',
            password: 'pass',
            name: 'Test',
            profileImageUrl: undefined,
            userAgent: 'test-agent',
            ipAddress: '127.0.0.1',
        });
        
        // Assert cookies were set
        expect(mockRes.cookie).toHaveBeenCalledWith('accessToken', 'acc-token', expect.any(Object));
        expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'ref-token', expect.any(Object));
        
        expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('loginUser should call loginUserService and set cookies', async () => {
        const mockResult = { 
            id: 'u1',
            email: 'test@test.com',
            name: 'Test',
            profileImageUrl: '',
            message: 'Login successful',
            accessToken: 'acc-token', 
            refreshToken: 'ref-token' 
        };
        vi.mocked(authService.loginUserService).mockResolvedValue(mockResult as any);

        mockReq.body = { email: 'test@test.com', password: 'pass' };

        await loginUser(mockReq, mockRes, mockNext);

        expect(authService.loginUserService).toHaveBeenCalledWith({
            email: 'test@test.com',
            password: 'pass',
            userAgent: 'test-agent',
            ipAddress: '127.0.0.1',
        });
        
        // Assert cookies were set
        expect(mockRes.cookie).toHaveBeenCalledWith('accessToken', 'acc-token', expect.any(Object));
        expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'ref-token', expect.any(Object));
    });

    it('logoutUser should clear cookies', async () => {
        mockReq.cookies = {}; // No refresh token
        
        await logoutUser(mockReq, mockRes, mockNext);

        // Assert cookies are cleared
        expect(mockRes.cookie).toHaveBeenCalledWith('accessToken', '', expect.objectContaining({
            httpOnly: true,
        }));
        expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', '', expect.objectContaining({
            httpOnly: true,
        }));
        
        expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('refreshTokenController should return 401 if no refresh token', async () => {
        mockReq.cookies = {};

        await refreshTokenController(mockReq, mockRes, mockNext); 

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'No refresh token found',
        }));
    });

    it('refreshTokenController should rotate tokens successfully', async () => {
        mockReq.cookies.refreshToken = 'old-refresh';
        
        vi.spyOn(jwt, 'verify').mockReturnValue({ id: 'u1' } as any);
        vi.mocked(authService.hashToken).mockReturnValue('hashed');
        
        const mockSession = { deleteOne: vi.fn() };
        vi.mocked(UserSession.findOne).mockResolvedValue(mockSession as any);
        
        vi.mocked(authService.createAuthSession).mockResolvedValue({
            accessToken: 'new-acc',
            refreshToken: 'new-ref'
        });

        await refreshTokenController(mockReq, mockRes, mockNext); 

        expect(UserSession.findOne).toHaveBeenCalledWith({ user: 'u1', refreshTokenHash: 'hashed' });
        expect(mockSession.deleteOne).toHaveBeenCalled();
        expect(authService.createAuthSession).toHaveBeenCalledWith('u1', 'test-agent', '127.0.0.1');
        
        expect(mockRes.cookie).toHaveBeenCalledWith('accessToken', 'new-acc', expect.any(Object));
        expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'new-ref', expect.any(Object));
        expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('refreshTokenController should revoke sessions on token reuse', async () => {
        mockReq.cookies.refreshToken = 'reused-refresh';
        vi.spyOn(jwt, 'verify').mockReturnValue({ id: 'u1' } as any);
        vi.mocked(UserSession.findOne).mockResolvedValue(null);

        await refreshTokenController(mockReq, mockRes, mockNext); 

        expect(UserSession.deleteMany).toHaveBeenCalledWith({ user: 'u1' });
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Invalid refresh token. Sessions revoked.',
        }));
    });

    it('refreshTokenController should handle malformed JWT', async () => {
        mockReq.cookies.refreshToken = 'bad-token';
        vi.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('invalid') });

        await refreshTokenController(mockReq, mockRes, mockNext); 

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Invalid refresh token',
        }));
    });
});
