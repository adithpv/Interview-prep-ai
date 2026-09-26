import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { assertFieldsExist } from "../utils/appAssert";
import { HttpStatus } from "../utils/httpStatus";
import { sendResponse } from "../utils/responseHandler";
import { ENV } from "../utils/env";
import { AuthenticatedRequest } from "../types";
import {
    registerUserService,
    loginUserService,
    getUserProfileService,
    uploadImageService,
} from "../services/authService";

const setTokensAsCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
) => {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const registerUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password, name, profileImageUrl } = req.body;
    assertFieldsExist({ email, password, name });

    const result = await registerUserService({
        email,
        password,
        name,
        profileImageUrl,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
    });

    setTokensAsCookies(res, result.accessToken, result.refreshToken);

    return sendResponse({
        res,
        statusCode: HttpStatus.CREATED,
        message: result.message,
        data: {
            _id: result.id,
            email: result.email,
            name: result.name,
            profileImageUrl: result.profileImageUrl,
        },
    });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    assertFieldsExist({ email, password });

    const result = await loginUserService({ 
        email, 
        password,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
    });

    setTokensAsCookies(res, result.accessToken, result.refreshToken);

    return sendResponse({
        res,
        statusCode: HttpStatus.OK,
        message: result.message,
        data: {
            _id: result.id,
            email: result.email,
            name: result.name,
            profileImageUrl: result.profileImageUrl,
        },
    });
});

export const getUserProfile = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.user?._id?.toString();
        assertFieldsExist({ userId });

        const result = await getUserProfileService(userId!);

        return sendResponse({ res, statusCode: HttpStatus.OK, data: result });
    },
);

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
    const { file } = req;
    assertFieldsExist({ file });

    const result = await uploadImageService(
        file!.buffer,
        file!.originalname,
        file!.mimetype,
    );

    sendResponse({ res, statusCode: HttpStatus.OK, data: result });
});

import { UserSession } from "../models/userSessionModel";
import { hashToken, createAuthSession } from "../services/authService";

export const refreshTokenController = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return sendResponse({
                res,
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "No refresh token found",
            });
        }

        try {
            const decoded = jwt.verify(
                refreshToken,
                ENV.JWT_REFRESH_SECRET,
            ) as { id: string };

            const hashedToken = hashToken(refreshToken);
            const session = await UserSession.findOne({ 
                user: decoded.id, 
                refreshTokenHash: hashedToken 
            });

            if (!session) {
                // Token reuse detected or session revoked!
                // Revoke all sessions for this user for security
                await UserSession.deleteMany({ user: decoded.id });
                return sendResponse({
                    res,
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: "Invalid refresh token. Sessions revoked.",
                });
            }

            // Delete the old session (Rotate)
            await session.deleteOne();

            // Create new tokens and session
            const newTokens = await createAuthSession(
                decoded.id, 
                req.headers["user-agent"], 
                req.ip
            );

            setTokensAsCookies(res, newTokens.accessToken, newTokens.refreshToken);

            sendResponse({
                res,
                statusCode: HttpStatus.OK,
                message: "Token refreshed",
            });
        } catch (e) { console.error("Error in refreshToken:", e);
            return sendResponse({
                res,
                statusCode: HttpStatus.UNAUTHORIZED,
                message: "Invalid refresh token",
            });
        }
    },
);

export const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET) as { id: string };
            const hashedToken = hashToken(refreshToken);
            await UserSession.deleteOne({ user: decoded.id, refreshTokenHash: hashedToken });
        } catch (e) { console.error("Error in refreshToken:", e);
            // ignore if already expired or invalid
        }
    }

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("accessToken", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(0),
    });
    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(0),
    });

    sendResponse({
        res,
        statusCode: HttpStatus.OK,
        message: "Logged out successfully",
    });
});
