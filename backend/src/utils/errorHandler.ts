import { Request, Response, NextFunction } from "express";
import { AppError, BadRequestException, UnauthorizedException, ForbiddenException } from "./AppError";

interface ErrorResponse {
    status: string;
    message: string;
    stack?: string;
    errors?: any;
}

const handleCastErrorDB = (err: any): AppError => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new BadRequestException(message);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
    let value = "unknown";
    if (err.errmsg) {
        const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
        value = match ? match[0] : value;
    } else if (err.keyValue) {
        value = JSON.stringify(err.keyValue);
    }
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new BadRequestException(message);
};

const handleValidationErrorDB = (err: any): AppError => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new BadRequestException(message);
};

const handleJWTError = (): AppError =>
    new UnauthorizedException("Invalid token. Please log in again!");

const handleJWTExpiredError = (): AppError =>
    new UnauthorizedException("Your token has expired! Please log in again.");

const handleCSRFError = (): AppError =>
    new ForbiddenException("Invalid CSRF Token.");

const handleMulterError = (err: any): AppError => 
    new BadRequestException(err.message);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
    res.status(err.statusCode).json({
        success: false,
        error: {
            code: err.name,
            message: err.message,
            stack: err.stack,
            details: err
        },
        requestId: (req as any).requestId,
    });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.name || 'API_ERROR',
                message: err.message,
            },
            requestId: (req as any).requestId,
        });
    } else {
        console.error("ERROR 💥", err);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: "Something went very wrong!",
            },
            requestId: (req as any).requestId,
        });
    }
};

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = Object.assign(err, {
        message: err.message,
        name: err.name,
        code: err.code
    });

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (error.code === "EBADCSRFTOKEN") error = handleCSRFError();
    if (error.name === "MulterError") error = handleMulterError(error);

    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, req, res);
    } else {
        sendErrorProd(error, req, res);
    }
};
