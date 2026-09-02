import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

/**
 * Validates (and sanitizes) req.body against a Zod schema.
 * On failure the ZodError is forwarded to the global error handler.
 * Supports multipart uploads where the JSON payload arrives as a
 * stringified `body.data` field.
 */
export const validateRequest =
  (zodSchema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (typeof req.body?.data === "string") {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        // leave req.body untouched; schema validation will report it
      }
    }

    const parsedResult = zodSchema.safeParse(req.body);

    if (!parsedResult.success) {
      next(parsedResult.error);
      return;
    }

    req.body = parsedResult.data;
    next();
  };
