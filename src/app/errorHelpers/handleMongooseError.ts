import mongoose from "mongoose";
import status from "http-status";
import { TErrorResponse } from "../types/error.interface.js";

/**
 * Mongoose-side replacements for the reference implementation's
 * handlePrismaError helpers.
 */

const handleValidationError = (
  error: mongoose.Error.ValidationError
): TErrorResponse => ({
  statusCode: status.BAD_REQUEST,
  message: Object.values(error.errors)[0]?.message ?? "Validation failed",
  errorSources: Object.values(error.errors).map((err) => ({
    path: err.path ?? "",
    message: err.message,
  })),
});

const handleCastError = (error: mongoose.Error.CastError): TErrorResponse => ({
  statusCode: status.BAD_REQUEST,
  message: `Invalid value "${error.value}" for path "${error.path}"`,
  errorSources: [
    {
      path: error.path ?? "",
      message: `Invalid value "${error.value}" for path "${error.path}"`,
    },
  ],
});

const handleDuplicateKeyError = (error: {
  keyValue?: Record<string, unknown>;
}): TErrorResponse => {
  const fields = Object.keys(error.keyValue ?? {}).join(", ");
  const message = fields
    ? `Duplicate value for ${fields}`
    : "Duplicate key error";

  return {
    statusCode: status.CONFLICT,
    message,
    errorSources: [{ path: fields, message }],
  };
};

export { handleValidationError, handleCastError, handleDuplicateKeyError };
