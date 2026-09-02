import type { IRequestUser } from "./user.interface.js";

declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
    }
  }
}

export {};
