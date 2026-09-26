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
export const sendResponse = <T>({
  res,
  statusCode = HttpStatus.OK,
  message,
  data,
}: ApiResponse<T>) => {
  const responseObj: any = {
    success: statusCode >= 200 && statusCode < 300,
  };

  if (message) {
    responseObj.message = message;
  }

  if (data !== undefined) {
    responseObj.data = data;
  }
  
  const req = res.req as any;
  if (req && req.requestId) {
    responseObj.requestId = req.requestId;
  }

  return res.status(statusCode).json(responseObj);
};
