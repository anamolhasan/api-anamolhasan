import type {
  ParameterObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  SchemaObject,
} from "openapi3-ts/oas30";

export const schemaRef = (name: string): ReferenceObject => ({
  $ref: `#/components/schemas/${name}`,
});

/**
 * Builds the unified success envelope used by every endpoint:
 *   { success, message, data?, meta? }
 */
export const successEnvelope = (
  message: string,
  data?: SchemaObject | ReferenceObject,
  meta?: SchemaObject | ReferenceObject
): SchemaObject => {
  const properties: Record<string, SchemaObject | ReferenceObject> = {
    success: {
      type: "boolean",
      example: true,
      description: "Always true for successful responses.",
    },
    message: { type: "string", example: message },
  };

  if (data) {
    properties.data = data;
  }
  if (meta) {
    properties.meta = meta;
  }

  return {
    type: "object",
    properties,
    required: ["success", "message"],
  };
};

export const successResponse = (
  description: string,
  schema: SchemaObject | ReferenceObject
): ResponseObject => ({
  description,
  content: {
    "application/json": { schema },
  },
});

type ErrorSchemaName =
  | "ValidationError"
  | "BadRequest"
  | "Unauthorized"
  | "Forbidden"
  | "NotFound"
  | "Conflict"
  | "UnprocessableEntity"
  | "InternalServerError";

const ERROR_DESCRIPTIONS: Record<ErrorSchemaName, string> = {
  ValidationError:
    "The request body or parameters fail validation.",
  BadRequest: "The request is malformed, invalid, or fails validation.",
  Unauthorized:
    "Authentication is required or the bearer token is invalid or expired.",
  Forbidden:
    "Authenticated but the current role is not allowed to perform this action.",
  NotFound: "The requested resource does not exist.",
  Conflict: "The request conflicts with the current state of the resource.",
  UnprocessableEntity:
    "The request is well-formed but contains semantic errors.",
  InternalServerError: "An unexpected error occurred on the server.",
};

export const errorResponse = (
  error: ErrorSchemaName,
  message: string
): ResponseObject => ({
  description: ERROR_DESCRIPTIONS[error],
  content: {
    "application/json": {
      schema: schemaRef(error),
      example: {
        success: false,
        message,
        errorSources: [{ path: "", message }],
      },
    },
  },
});

export const pathParameter = (
  name: string,
  description: string,
  schema: SchemaObject
): ParameterObject => ({
  name,
  in: "path",
  required: true,
  description,
  schema,
});

export const queryParameter = (
  name: string,
  description: string,
  schema: SchemaObject
): ParameterObject => ({
  name,
  in: "query",
  description,
  schema,
});

export const jsonRequestBody = (
  schema: ReferenceObject,
  description: string
): RequestBodyObject => ({
  description,
  required: true,
  content: {
    "application/json": { schema },
  },
});

interface ErrorExample {
  path: string;
  message: string;
}

const errorSchema = (
  message: string,
  errorSources: ErrorExample[]
): SchemaObject => ({
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: false,
      description: "Always false for error responses.",
    },
    message: { type: "string", example: message },
    errorSources: {
      type: "array",
      description: "One or more field-or-request level error details.",
      items: schemaRef("ErrorSource"),
      example: errorSources,
    },
    stack: {
      type: "string",
      nullable: true,
      description:
        'Stack trace. Only included when NODE_ENV is not "production".',
    },
  },
  required: ["success", "message", "errorSources"],
});

export const commonSchemas: Record<string, SchemaObject | ReferenceObject> = {
  ErrorSource: {
    type: "object",
    description: "A single field-or-request level error detail.",
    properties: {
      path: {
        type: "string",
        description:
          "Field or request path that produced the error. Empty string for global errors.",
        example: "title",
      },
      message: {
        type: "string",
        description: "Human-readable description of the error.",
        example: "Title is required",
      },
    },
    required: ["path", "message"],
  },

  ErrorResponse: errorSchema("Something went wrong", [
    { path: "", message: "Something went wrong" },
  ]),

  SuccessResponse: successEnvelope("Operation completed successfully"),

  PaginationMeta: {
    type: "object",
    description: "Pagination metadata returned by list endpoints.",
    properties: {
      page: {
        type: "integer",
        minimum: 1,
        description: "Current page (1-indexed).",
        example: 1,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        description: "Number of items per page (max 100).",
        example: 10,
      },
      total: {
        type: "integer",
        minimum: 0,
        description: "Total number of documents matching the query.",
        example: 42,
      },
      totalPages: {
        type: "integer",
        minimum: 1,
        description: "Total number of pages.",
        example: 5,
      },
    },
    required: ["page", "limit", "total", "totalPages"],
  },

  Pagination: successEnvelope(
    "List fetched successfully",
    {
      type: "array",
      description: "Page of items.",
      items: {},
    },
    schemaRef("PaginationMeta")
  ),

  ValidationError: errorSchema("Validation failed", [
    { path: "title", message: "Title is required" },
  ]),

  BadRequest: errorSchema("Bad request", [
    { path: "", message: "Bad request" },
  ]),

  Unauthorized: errorSchema("You are not authorized", [
    { path: "", message: "You are not authorized" },
  ]),

  Forbidden: errorSchema(
    "You do not have permission to perform this action",
    [{ path: "", message: "You do not have permission to perform this action" }]
  ),

  NotFound: errorSchema("Resource not found", [
    { path: "", message: "Resource not found" },
  ]),

  Conflict: errorSchema("Duplicate value for slug", [
    { path: "slug", message: "Duplicate value for slug" },
  ]),

  UnprocessableEntity: errorSchema("Unprocessable entity", [
    { path: "", message: "Unprocessable entity" },
  ]),

  InternalServerError: errorSchema("Something went wrong", [
    { path: "", message: "Something went wrong" },
  ]),
};