import status from "http-status";
import { ZodError } from "zod";
import { TErrorResponse } from "../types/error.interface.js";

const handleZodError = (error: ZodError): TErrorResponse => ({
  statusCode: status.BAD_REQUEST,
  message: error.issues[0]?.message ?? "Validation failed",
  errorSources: error.issues.map((issue) => ({
    path: issue.path.join(" => "),
    message: issue.message,
  })),
});

export default handleZodError;
