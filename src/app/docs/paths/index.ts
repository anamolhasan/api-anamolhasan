import type { PathItemObject } from "openapi3-ts/oas30";
import { systemPaths } from "./system.js";
import { projectPaths } from "./project.js";
import { uploadPaths } from "./upload.js";

export const paths: Record<string, PathItemObject> = {
  ...systemPaths,
  ...projectPaths,
  ...uploadPaths,
};