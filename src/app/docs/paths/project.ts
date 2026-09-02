import type { PathItemObject } from "openapi3-ts/oas30";
import {
  errorResponse,
  jsonRequestBody,
  pathParameter,
  queryParameter,
  schemaRef,
  successResponse,
} from "../schemas/common.js";

const projectIdExample = "661e6df9c4a4a3001f2a3b4c";

const projectIdParameter = pathParameter(
  "id",
  "MongoDB ObjectId of the project.",
  {
    type: "string",
    pattern: "^[a-f0-9]{24}$",
    example: projectIdExample,
  }
);

const projectsPath: PathItemObject = {
  get: {
    tags: ["Projects"],
    summary: "List projects",
    description:
      "Paginated list of portfolio projects, newest first. Supports full-text search, filtering by status/featured/category, pagination, sorting and field selection.",
    operationId: "listProjects",
    parameters: [
      queryParameter(
        "searchTerm",
        "Case-insensitive search across title, short description, description, category and technologies.",
        { type: "string", example: "portfolio" }
      ),
      queryParameter(
        "status",
        "Filter by publication status.",
        {
          type: "string",
          enum: ["published", "draft", "archived"],
        }
      ),
      queryParameter("featured", "Filter by the featured flag.", {
        type: "boolean",
        example: true,
      }),
      queryParameter("category", "Filter by category.", {
        type: "string",
        example: "Full Stack",
      }),
      queryParameter("page", "Page number (1-indexed).", {
        type: "integer",
        minimum: 1,
        default: 1,
        example: 1,
      }),
      queryParameter("limit", "Number of items per page (max 100).", {
        type: "integer",
        minimum: 1,
        maximum: 100,
        default: 10,
        example: 10,
      }),
      queryParameter(
        "sortBy",
        'Sort field(s), comma-separated. Prefix a field with "-" for descending order.',
        { type: "string", default: "-createdAt", example: "-createdAt" }
      ),
      queryParameter(
        "fields",
        'Comma-separated list of fields to project. Prefix a field with "-" to exclude it.',
        { type: "string", example: "title,technologies" }
      ),
    ],
    responses: {
      200: successResponse(
        "Projects fetched successfully",
        schemaRef("ProjectListResponse")
      ),
      400: errorResponse("BadRequest", "Invalid query parameters"),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },

  post: {
    tags: ["Projects"],
    summary: "Create a project",
    description:
      "Creates a new project. Requires an ADMIN or SUPER_ADMIN role.",
    operationId: "createProject",
    security: [{ bearerAuth: [] }],
    requestBody: jsonRequestBody(
      schemaRef("CreateProjectInput"),
      "Project payload to create."
    ),
    responses: {
      201: successResponse(
        "Project created successfully",
        schemaRef("ProjectResponse")
      ),
      400: errorResponse("ValidationError", "Validation failed"),
      401: errorResponse("Unauthorized", "You are not authorized"),
      403: errorResponse(
        "Forbidden",
        "You do not have permission to perform this action"
      ),
      409: errorResponse("Conflict", "Duplicate value for slug"),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },
};

const projectByIdPath: PathItemObject = {
  parameters: [projectIdParameter],

  get: {
    tags: ["Projects"],
    summary: "Get a project by id",
    description:
      "Returns a single project by its MongoDB ObjectId. No authentication required.",
    operationId: "getProject",
    responses: {
      200: successResponse(
        "Project fetched successfully",
        schemaRef("ProjectResponse")
      ),
      400: errorResponse("BadRequest", "Invalid project id"),
      404: errorResponse("NotFound", "Project not found"),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },

  put: {
    tags: ["Projects"],
    summary: "Update a project",
    description:
      "Updates an existing project with the provided fields. Requires an ADMIN or SUPER_ADMIN role.",
    operationId: "updateProject",
    security: [{ bearerAuth: [] }],
    requestBody: jsonRequestBody(
      schemaRef("UpdateProjectInput"),
      "Partial project payload to apply."
    ),
    responses: {
      200: successResponse(
        "Project updated successfully",
        schemaRef("ProjectResponse")
      ),
      400: errorResponse("ValidationError", "Validation failed"),
      401: errorResponse("Unauthorized", "You are not authorized"),
      403: errorResponse(
        "Forbidden",
        "You do not have permission to perform this action"
      ),
      404: errorResponse("NotFound", "Project not found"),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },

  delete: {
    tags: ["Projects"],
    summary: "Delete a project",
    description:
      "Deletes a project and removes its images and thumbnail from Cloudinary. Requires an ADMIN or SUPER_ADMIN role.",
    operationId: "deleteProject",
    security: [{ bearerAuth: [] }],
    responses: {
      200: successResponse(
        "Project deleted successfully",
        schemaRef("ProjectDeleteResponse")
      ),
      400: errorResponse("BadRequest", "Invalid project id"),
      401: errorResponse("Unauthorized", "You are not authorized"),
      403: errorResponse(
        "Forbidden",
        "You do not have permission to perform this action"
      ),
      404: errorResponse("NotFound", "Project not found"),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },
};

export const projectPaths: Record<string, PathItemObject> = {
  "/api/v1/projects": projectsPath,
  "/api/v1/projects/{id}": projectByIdPath,
};