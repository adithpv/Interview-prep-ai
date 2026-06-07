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

  const payloadData =
    data && typeof (data as any).toJSON === "function"
      ? (data as any).toJSON()
      : data;

  return res.status(statusCode).json({
    status: "success",
    ...(message && { message }),
    ...(payloadData &&
    typeof payloadData === "object" &&
    !Array.isArray(payloadData)
      ? payloadData
      : payloadData !== undefined
        ? { result: payloadData }
        : {}),
  });
};
