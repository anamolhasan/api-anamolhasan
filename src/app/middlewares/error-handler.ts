import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import status from "http-status";
import { ZodError } from "zod";
import { MulterError } from "multer";
import AppError from "../errorHelpers/AppError.js";
import handleZodError from "../errorHelpers/handleZodError.js";
import {
  handleCastError,
  handleDuplicateKeyError,
  handleValidationError,
} from "../errorHelpers/handleMongooseError.js";
import { TErrorSources } from "../types/error.interface.js";
import { envVars } from "../config/env.js";

/**
 * Centralized error handler producing the unified envelope:
 *   { success: false, message, errorSources, stack? (non-production) }
 */
const globalErrorHandler: ErrorRequestHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorSources: TErrorSources[] = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (!envVars.NODE_ENV || envVars.NODE_ENV === "development") {
    console.error(`[${req.method}] ${req.originalUrl} ->`, error);
  }

  if (error instanceof ZodError) {
    ({ statusCode, message, errorSources } = handleZodError(error));
  } else if (error instanceof mongoose.Error.ValidationError) {
    ({ statusCode, message, errorSources } = handleValidationError(error));
  } else if (error instanceof mongoose.Error.CastError) {
    ({ statusCode, message, errorSources } = handleCastError(error));
  } else if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    ({ statusCode, message, errorSources } = handleDuplicateKeyError(
      error as { keyValue?: Record<string, unknown> }
    ));
  } else if (error instanceof MulterError) {
    statusCode = status.BAD_REQUEST;
    message = error.message;
    errorSources = [{ path: "", message }];
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [{ path: "", message }];
  } else if (error instanceof Error) {
    message = envVars.NODE_ENV === 'Production' ? "Something went wrong" : error.message;
    errorSources = [{ path: "", message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV ? undefined : error instanceof Error ? error.stack : undefined,
  });
};

export default globalErrorHandler;
