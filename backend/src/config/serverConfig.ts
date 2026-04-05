import cors from "cors";
import rateLimit from "express-rate-limit";
import { ENV } from "../utils/env";
import { helmetConfig } from "./helmetConfig";

export const corsConfig = cors({
    origin: ENV.NODE_ENV === "development" ? true : [ENV.ALLOWED_ORIGINS],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    credentials: true,
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: "Too many authentication attempts, please try again later.",
    },
    skipSuccessfulRequests: true,
});

export const generationLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10,
    message: {
        error: "You have exceeded the maximum of 10 AI generations per day for free tier users.",
    },
});

export const serverConfigs = {
    helmet: helmetConfig,
    cors: corsConfig,
    generalLimiter,
    authLimiter,
    generationLimiter,
};
