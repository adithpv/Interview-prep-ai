import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/userModel";
import { ENV } from "../utils/env";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/AppError";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const protect = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];

      const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

      if (!decoded || typeof decoded !== "object" || !decoded.id) {
        throw new AppError("Invalid token payload", 401);
      }

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        throw new AppError("User not found", 401);
      }

      req.user = user;
      next();
    } else {
      throw new AppError("Not authorized, no token provided", 401);
    }
  }
);
