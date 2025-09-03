import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { assertFieldsExist } from "../utils/appAssert";
import { HttpStatus } from "../utils/httpStatus";
import { AuthenticatedRequest } from "../types";
import {
    registerUserService,
    loginUserService,
    getUserProfileService,
    uploadImageService,
} from "../services/authService";

export const registerUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password, name, profileImageUrl } = req.body;
    assertFieldsExist({ email, password, name });

    const result = await registerUserService({
        email,
        password,
        name,
        profileImageUrl,
    });

    return res.status(201).json(result);
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    assertFieldsExist({ email, password });

    const result = await loginUserService({ email, password });

    return res.status(200).json(result);
});

export const getUserProfile = catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = req.params.id || req.user?._id;
        assertFieldsExist({ userId });

        const result = await getUserProfileService(userId);

        return res.status(200).json(result);
    }
);

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
    const { file } = req;
    assertFieldsExist({ file });

    const result = await uploadImageService(
        file?.filename || "",
        req.protocol,
        req.get("host") || ""
    );

    res.status(HttpStatus.OK).json(result);
});
