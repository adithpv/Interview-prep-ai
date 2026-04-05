import { Response } from "express";
import { HttpStatus } from "./httpStatus";

interface ApiResponse<T> {
    res: Response;
    statusCode?: number;
    message?: string;
    data?: T;
}

/**
 * Standardized API Response Wrapper
 */
export const sendResponse = <T extends object | null>({
    res,
    statusCode = HttpStatus.OK,
    message,
    data,
}: ApiResponse<T>) => {
    if (Array.isArray(data) && !message) {
        return res.status(statusCode).json(data);
    }

    return res.status(statusCode).json({
        status: "success",
        ...(message && { message }),
        ...(data && typeof data === "object" && !Array.isArray(data) ? data : data !== undefined ? { result: data } : {}),
    });
};
