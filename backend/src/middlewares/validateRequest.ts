import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { HttpStatus } from "../utils/httpStatus";

export const validateRequest = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                }));
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: "Validation Failed",
                    errors: formattedErrors,
                });
                return;
            }
            next(error);
        }
    };
};
