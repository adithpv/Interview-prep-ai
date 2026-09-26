import { HttpStatus } from "./httpStatus";

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestException extends AppError {
    constructor(message: string = "Bad Request") {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

export class UnauthorizedException extends AppError {
    constructor(message: string = "Unauthorized") {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

export class ForbiddenException extends AppError {
    constructor(message: string = "Forbidden") {
        super(message, HttpStatus.FORBIDDEN);
    }
}

export class NotFoundException extends AppError {
    constructor(message: string = "Not Found") {
        super(message, HttpStatus.NOT_FOUND);
    }
}

export class ConflictException extends AppError {
    constructor(message: string = "Conflict") {
        super(message, HttpStatus.CONFLICT);
    }
}

export class InternalServerErrorException extends AppError {
    constructor(message: string = "Internal Server Error") {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export class ServiceUnavailableException extends AppError {
    constructor(message: string = "Service Unavailable") {
        super(message, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
