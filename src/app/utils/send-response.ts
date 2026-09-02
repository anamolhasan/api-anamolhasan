import { Response } from "express";
import { TMeta } from "../types/query.interface.js";

interface ISendResponseData<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: TMeta;
}

/**
 * Sends the unified success envelope used by every endpoint:
 *   { success, message, data?, meta? }
 */
export const sendResponse = <T>(
  res: Response,
  responseData: ISendResponseData<T>
): void => {
  const { httpStatusCode, success, message, data, meta } = responseData;

  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta,
  });
};
