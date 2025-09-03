import bcrypt from "bcryptjs";
import { User } from "../models/userModel";
import { generateToken } from "../utils/generateToken";
import { assertAuth, assertNotFound, assertConflict } from "../utils/appAssert";

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

    return {
        message: "User registered successfully",
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profileImageUrl,
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
    token: string;
}> => {
    const { email, password } = params;

    const user = await User.findOne({ email });
    assertAuth(!!user, "Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user!.password);
    assertAuth(isPasswordValid, "Invalid credentials");

    const token = generateToken(user!._id.toString());

    return {
        message: "Login successful",
        id: user!._id.toString(),
        email: user!.email,
        name: user!.name,
        profileImageUrl: user!.profileImageUrl,
        token,
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
    filename: string,
    protocol: string,
    host: string
): Promise<{ imageUrl: string }> => {
    const imageUrl = `${protocol}://${host}/uploads/${filename}`;
    return { imageUrl };
};
