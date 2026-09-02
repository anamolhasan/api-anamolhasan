import type { PathItemObject, SchemaObject } from "openapi3-ts/oas30";
import {
  errorResponse,
  jsonRequestBody,
  schemaRef,
  successResponse,
} from "../schemas/common.js";

const multipartFileRequestBody: {
  required: boolean;
  content: { "multipart/form-data": { schema: SchemaObject } };
} = {
  required: true,
  content: {
    "multipart/form-data": {
      schema: {
        type: "object",
        properties: {
          file: {
            type: "string",
            format: "binary",
            description: "Image file to upload (PNG, JPG, WEBP, ...).",
          },
        },
        required: ["file"],
      },
    },
  },
};

const uploadPath: PathItemObject = {
  get: {
    tags: ["Uploads"],
    summary: "Cloudinary health check",
    description:
      "Checks connectivity with Cloudinary using api.ping(). No authentication required.",
    operationId: "cloudinaryHealthCheck",
    responses: {
      200: successResponse(
        "Cloudinary is reachable",
        schemaRef("UploadHealthResponse")
      ),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },

  post: {
    tags: ["Uploads"],
    summary: "Upload an image",
    description:
      "Uploads an image to Cloudinary. Send the file as multipart/form-data in a field named `file`. Requires an ADMIN or SUPER_ADMIN role.",
    operationId: "uploadFile",
    security: [{ bearerAuth: [] }],
    requestBody: multipartFileRequestBody,
    responses: {
      201: successResponse(
        "File uploaded successfully",
        schemaRef("UploadFileResponse")
      ),
      400: errorResponse("BadRequest", "Invalid file"),
      401: errorResponse("Unauthorized", "You are not authorized"),
      403: errorResponse(
        "Forbidden",
        "You do not have permission to perform this action"
      ),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },
};

const cloudinaryDeletePath: PathItemObject = {
  post: {
    tags: ["Uploads"],
    summary: "Delete an image",
    description:
      "Deletes a Cloudinary asset by its public id. Requires an ADMIN or SUPER_ADMIN role.",
    operationId: "deleteImage",
    security: [{ bearerAuth: [] }],
    requestBody: jsonRequestBody(
      schemaRef("DeleteImageInput"),
      "Cloudinary public id of the asset to delete."
    ),
    responses: {
      200: successResponse(
        "Image deleted successfully",
        schemaRef("UploadDeleteResponse")
      ),
      400: errorResponse("BadRequest", "publicId is required"),
      401: errorResponse("Unauthorized", "You are not authorized"),
      403: errorResponse(
        "Forbidden",
        "You do not have permission to perform this action"
      ),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },
};

const uploadTestPath: PathItemObject = {
  get: {
    tags: ["Uploads"],
    summary: "Test upload",
    description:
      "Uploads a Cloudinary demo image to verify credentials are configured correctly. Requires an ADMIN or SUPER_ADMIN role.",
    operationId: "testUpload",
    security: [{ bearerAuth: [] }],
    responses: {
      200: successResponse(
        "Test upload completed successfully",
        schemaRef("UploadTestResponse")
      ),
      401: errorResponse("Unauthorized", "You are not authorized"),
      403: errorResponse(
        "Forbidden",
        "You do not have permission to perform this action"
      ),
      500: errorResponse("InternalServerError", "Something went wrong"),
    },
  },
};

export const uploadPaths: Record<string, PathItemObject> = {
  "/api/v1/upload": uploadPath,
  "/api/v1/cloudinary/delete": cloudinaryDeletePath,
  "/api/v1/upload-test": uploadTestPath,
};