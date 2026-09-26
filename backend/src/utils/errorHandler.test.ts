import { describe, it, expect, vi } from 'vitest';
import { globalErrorHandler } from './errorHandler';
import { BadRequestException, UnauthorizedException } from './AppError';

describe('globalErrorHandler', () => {
    it('should normalize TokenExpiredError to UnauthorizedException in production', () => {
        process.env.NODE_ENV = 'production';
        const err = new Error('jwt expired');
        err.name = 'TokenExpiredError';

        const req = {} as any;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any;
        const next = vi.fn();

        globalErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            error: expect.objectContaining({
                code: 'UnauthorizedException'
            })
        }));
    });

    it('should normalize duplicate fields safely without errmsg crash', () => {
        process.env.NODE_ENV = 'production';
        const err: any = new Error('E11000 duplicate key error');
        err.code = 11000;
        err.keyValue = { email: "test@test.com" }; // modern mongo format

        const req = {} as any;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any;
        const next = vi.fn();

        globalErrorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            error: expect.objectContaining({
                message: expect.stringContaining('test@test.com')
            })
        }));
    });
});
