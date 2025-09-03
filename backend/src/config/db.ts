import mongoose from "mongoose";
import AppError from "../utils/AppError";
import { getEnv } from "../utils/env";
import { HttpStatus } from "../utils/httpStatus";

export interface ConnectionOptions {
    maxRetries: number;
    retryDelay: number;
    timeout: number;
}

const DEFAULT_OPTIONS: ConnectionOptions = {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 10000,
};

let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Connects to MongoDB with retry mechanism and error handling.
 */
export const connectDb = async (
    options: Partial<ConnectionOptions> = {}
): Promise<typeof mongoose> => {
    if (isConnected) return mongoose;
    if (connectionPromise) return connectionPromise;

    const { maxRetries, retryDelay, timeout } = {
        ...DEFAULT_OPTIONS,
        ...options,
    };
    const uri = getEnv<string>("MONGO_DB_URI");

    if (!uri) {
        throw new AppError(
            "MongoDB URI not configured",
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    const connectWithRetry = async (
        retryCount = 0
    ): Promise<typeof mongoose> => {
        try {
            const connection = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: timeout,
                socketTimeoutMS: timeout,
            });

            isConnected = true;
            console.log("✅ MongoDB connected");
            return connection;
        } catch (error) {
            if (retryCount < maxRetries) {
                console.warn(
                    `⚠️ Retry ${retryCount + 1}/${maxRetries}: MongoDB connection failed. Retrying in ${retryDelay}ms...`
                );
                await new Promise((res) => setTimeout(res, retryDelay));
                return connectWithRetry(retryCount + 1);
            }

            isConnected = false;
            connectionPromise = null;
            throw new AppError(
                `❌ Failed to connect to MongoDB after ${maxRetries} retries: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    };

    connectionPromise = connectWithRetry();
    return connectionPromise;
};

/**
 * Disconnects from MongoDB gracefully.
 */
export const disconnectDb = async (): Promise<void> => {
    if (!isConnected) return;

    try {
        await mongoose.disconnect();
        isConnected = false;
        connectionPromise = null;
        console.log("🛑 MongoDB disconnected");
    } catch (error) {
        throw new AppError(
            `❌ Failed to disconnect from MongoDB: ${error instanceof Error ? error.message : "Unknown error"}`,
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Returns current connection state.
 */
export const isDbConnected = (): boolean => isConnected;
