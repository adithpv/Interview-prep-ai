import bcrypt from "bcryptjs";
import { User } from "../models/userModel";
import { generateTokens } from "../utils/generateToken";
import { assertAuth, assertNotFound, assertConflict } from "../utils/appAssert";
import cloudinary from "../config/cloudinary";

export interface RegisterUserParams {
    email: string;
    password: string;
    name: string;
    profileImageUrl?: string;
}

export interface LoginUserParams {
    email: string;
    password: string;
}

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
}

export const registerUserService = async (
    params: RegisterUserParams
): Promise<{
    message: string;
    id: string;
    email: string;
    name: string;
    profileImageUrl?: string;
    accessToken: string;
    refreshToken: string;
}> => {
    const { email, password, name, profileImageUrl } = params;

    const userExist = await User.findOne({ email });
    assertConflict(!userExist, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        profileImageUrl,
    });

    const { accessToken, refreshToken } = generateTokens(user!._id.toString());

    return {
        message: "User registered successfully",
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profileImageUrl,
        accessToken,
        refreshToken,
    };
};

export const loginUserService = async (
    params: LoginUserParams
): Promise<{
    message: string;
    id: string;
    email: string;
    name: string;
    profileImageUrl?: string;
    accessToken: string;
    refreshToken: string;
}> => {
    const { email, password } = params;

    const user = await User.findOne({ email });
    assertAuth(!!user, "Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user!.password);
    assertAuth(isPasswordValid, "Invalid credentials");

    const { accessToken, refreshToken } = generateTokens(user!._id.toString());

    return {
        message: "Login successful",
        id: user!._id.toString(),
        email: user!.email,
        name: user!.name,
        profileImageUrl: user!.profileImageUrl,
        accessToken,
        refreshToken,
    };
};

export const getUserProfileService = async (
    userId: string
): Promise<{
    message: string;
    user: UserProfile;
}> => {
    const user = await User.findById(userId).select("-password");
    assertNotFound(!!user, "User");

    return {
        message: "User profile fetched",
        user: {
            _id: user!._id.toString(),
            name: user!.name,
            email: user!.email,
            profileImageUrl: user!.profileImageUrl,
        },
    };
};

export const uploadImageService = async (
    fileBuffer: Buffer,
    originalName: string,
    mimetype: string
): Promise<{ imageUrl: string }> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_pictures" },
            (error: any, result: any) => {
                if (result) {
                    resolve({ imageUrl: result.secure_url });
                } else {
                    reject(error);
                }
            }
        );
        require("stream").Readable.from(fileBuffer).pipe(stream);
    });
};
