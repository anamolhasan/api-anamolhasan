import { clerkClient, getAuth } from "@clerk/express";
import { NextFunction, Request, RequestHandler, Response } from "express";
import status from "http-status";
import AppError from "../errorHelpers/AppError.js";
import { ROLE_VALUES, Role, TRole } from "../constants/roles.js";

interface ISessionClaimsWithRole {
  publicMetadata?: { role?: string };
  metadata?: { role?: string };
}

const normalizeRole = (value: unknown): TRole | null =>
  typeof value === "string" && ROLE_VALUES.includes(value)
    ? (value as TRole)
    : null;

/**
 * Role-based authentication guard powered by Clerk.
 *
 * - Rejects unauthenticated requests with 401.
 * - Resolves the user's role from the session claims
 *   (`publicMetadata.role`), falling back to the Clerk profile.
 * - When roles are provided, rejects unauthorized roles with 403 and
 *   attaches the resolved identity to `req.user`.
 *
 * Usage: checkAuth(Role.ADMIN, Role.SUPER_ADMIN)
 */
export const checkAuth =
  (...requiredRoles: TRole[]): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authState = getAuth(req);

      if (!authState.userId) {
        throw new AppError(status.UNAUTHORIZED, "You are not authorized");
      }

      const claims = (authState.sessionClaims ?? {}) as ISessionClaimsWithRole;
      let role =
        normalizeRole(claims.publicMetadata?.role) ??
        normalizeRole(claims.metadata?.role);

      // Only hit the Clerk API when a role is actually required and the
      // session token does not carry one.
      if (!role && requiredRoles.length > 0) {
        try {
          const user = await clerkClient.users.getUser(authState.userId);
          role = normalizeRole(user.publicMetadata?.role);
        } catch {
          throw new AppError(
            status.FORBIDDEN,
            "Unable to verify your role right now"
          );
        }
      }

      role = role ?? Role.USER;

      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(role)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "You do not have permission to perform this action"
        );
      }

      req.user = { userId: authState.userId, role };
      next();
    } catch (error) {
      next(error);
    }
  };
