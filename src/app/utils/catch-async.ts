import { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/**
 * Wraps an async route handler and forwards any rejection
 * to the global error handler via next().
 */
const catchAsync =
  (fn: AsyncRequestHandler): RequestHandler =>
  (req, res, next) => {
    void fn(req, res, next).catch(next);
  };

export default catchAsync;
