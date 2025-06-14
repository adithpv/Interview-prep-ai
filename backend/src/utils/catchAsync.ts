import { Request, Response, NextFunction } from "express";

type AsyncFunction<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const catchAsync = <T extends Request = Request>(
  fn: AsyncFunction<T>
) => {
  return (req: T, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
