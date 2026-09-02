import type { PathItemObject } from "openapi3-ts/oas30";
import { errorResponse, schemaRef, successResponse } from "../schemas/common.js";

const healthPath: PathItemObject = {
  get: {
    tags: ["System"],
    summary: "Health check",
    description:
      "Returns a lightweight success response used to verify the API is up and running. No authentication required.",
    operationId: "getHealth",
    responses: {
      200: successResponse("API is running", schemaRef("SuccessResponse")),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },
};

export const systemPaths: Record<string, PathItemObject> = {
  "/health": healthPath,
};