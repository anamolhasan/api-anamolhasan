import type { ReferenceObject, SchemaObject } from "openapi3-ts/oas30";
import { schemaRef } from "./common.js";

const roleSchema: SchemaObject = {
  type: "string",
  enum: ["SUPER_ADMIN", "ADMIN", "USER"],
  description:
    "Application role resolved from the Clerk user profile (publicMetadata.role).",
  example: "ADMIN",
};

const userSchema: SchemaObject = {
  type: "object",
  description:
    "Authenticated user identity attached to requests by the checkAuth guard.",
  properties: {
    userId: {
      type: "string",
      description: "Clerk user id (subject claim of the session token).",
      example: "user_2abcdefghijklmno",
    },
    role: schemaRef("Role"),
  },
  required: ["userId", "role"],
};

const sessionClaimsSchema: SchemaObject = {
  type: "object",
  description:
    "Relevant subset of the Clerk session token claims used to resolve roles.",
  properties: {
    sub: {
      type: "string",
      description: "Clerk user id (subject).",
      example: "user_2abcdefghijklmno",
    },
    email: {
      type: "string",
      format: "email",
      description: "Primary email address, when included in the token template.",
    },
    role: schemaRef("Role"),
  },
};

export const userSchemas: Record<string, SchemaObject | ReferenceObject> = {
  Role: roleSchema,
  User: userSchema,
  SessionClaims: sessionClaimsSchema,
};