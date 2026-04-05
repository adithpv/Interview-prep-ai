import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: any;
}

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
    email: string;
    name: string;
    profileImageUrl?: string;
}
