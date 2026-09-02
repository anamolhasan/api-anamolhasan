import type { ReferenceObject, SchemaObject } from "openapi3-ts/oas30";
import { commonSchemas } from "./common.js";
import { projectSchemas } from "./project.js";
import { uploadSchemas } from "./upload.js";
import { userSchemas } from "./user.js";

export const schemas: Record<string, SchemaObject | ReferenceObject> = {
  ...commonSchemas,
  ...userSchemas,
  ...projectSchemas,
  ...uploadSchemas,
};