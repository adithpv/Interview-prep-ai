import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser, logoutUser } from './authController';
import * as authService from '../services/authService';

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
});
