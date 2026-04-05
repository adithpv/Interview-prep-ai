import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { assertFieldsExist } from "../utils/appAssert";
import { HttpStatus } from "../utils/httpStatus";
import { sendResponse } from "../utils/responseHandler";
import { AuthenticatedRequest } from "../types";
import {
    registerUserService,
    loginUserService,
    getUserProfileService,
    uploadImageService,
} from "../services/authService";

const setTokensAsCookies = (res: Response, accessToken: string, refreshToken: string) => {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
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

    const result = await loginUserService({ email, password });

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
        const userId = req.params.id || req.user?._id;
        assertFieldsExist({ userId });

        const result = await getUserProfileService(userId);

        return sendResponse({ res, statusCode: HttpStatus.OK, data: result });
    }
);

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
    const { file } = req;
    assertFieldsExist({ file });

    const result = await uploadImageService(
        file!.buffer,
        file!.originalname,
        file!.mimetype
    );

    sendResponse({ res, statusCode: HttpStatus.OK, data: result });
});

export const refreshTokenController = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return sendResponse({ res, statusCode: HttpStatus.UNAUTHORIZED, message: "No refresh token found" });
    }

    try {
        const decoded = require("jsonwebtoken").verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_fallback_secret") as { id: string };
        const newAccessToken = require("jsonwebtoken").sign({ id: decoded.id }, process.env.JWT_SECRET || "", { expiresIn: "15m" });
        
        const isProd = process.env.NODE_ENV === "production";
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        sendResponse({ res, statusCode: HttpStatus.OK, message: "Token refreshed" });
    } catch (e) {
        return sendResponse({ res, statusCode: HttpStatus.UNAUTHORIZED, message: "Invalid refresh token" });
    }
});

export const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("accessToken", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        expires: new Date(0),
    });
    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        expires: new Date(0),
    });

    sendResponse({ res, statusCode: HttpStatus.OK, message: "Logged out successfully" });
});
