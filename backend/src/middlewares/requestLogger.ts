import { Request, Response, NextFunction } from "express";

export const requestLogger = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    const chalk = (await import("chalk")).default;
    const method = chalk.bold.green(req.method.padEnd(6));
    const url = chalk.blueBright(req.originalUrl);
    const time = chalk.gray(new Date().toLocaleTimeString());
    const requestId = (req as any).requestId ? chalk.magenta(`[${(req as any).requestId}]`) : "";

    console.log(`${time} ${requestId} ${method} → ${url}`);

    next();
};
