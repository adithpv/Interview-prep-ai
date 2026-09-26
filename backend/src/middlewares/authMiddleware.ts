import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { ENV } from "../utils/env";
import { catchAsync } from "../utils/catchAsync";
import { UnauthorizedException } from "../utils/AppError";
import { AuthenticatedRequest } from "../types";

export const protect = catchAsync(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken;

        if (token) {
            const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

            if (!decoded || typeof decoded !== "object" || !decoded.id) {
                throw new UnauthorizedException("Invalid token payload");
            }

            req.user = { _id: decoded.id } as any;
            next();
        } else {
            throw new UnauthorizedException("Not authorized, no token provided");
        }
    }
);
