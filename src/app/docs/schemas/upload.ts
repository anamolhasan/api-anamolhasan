import type { ReferenceObject, SchemaObject } from "openapi3-ts/oas30";
import { successEnvelope } from "./common.js";

const uploadFileResponseSchema: SchemaObject = successEnvelope(
  "File uploaded successfully",
  {
    type: "object",
    description: "References of the uploaded image.",
    properties: {
      url: {
        type: "string",
        format: "uri",
        description: "Public delivery URL of the uploaded image.",
        example:
          "https://res.cloudinary.com/demo/image/upload/v1/portfolio/abc.jpg",
      },
      publicId: {
        type: "string",
        description: "Cloudinary public id, used to delete the asset later.",
        example: "portfolio/abc",
      },
    },
    required: ["url", "publicId"],
  }
);

const uploadHealthResponseSchema: SchemaObject = successEnvelope(
  "Cloudinary is reachable",
  {
    type: "object",
    properties: {
      result: {
        type: "object",
        additionalProperties: true,
        description: "Raw Cloudinary api.ping() payload.",
        example: { status: "ok" },
      },
    },
  }
);

const uploadDeleteResponseSchema: SchemaObject = successEnvelope(
  "Image deleted successfully",
  {
    type: "object",
    additionalProperties: true,
    description: "Raw Cloudinary destroy result.",
    example: { result: "ok" },
  }
);

const uploadTestResponseSchema: SchemaObject = successEnvelope(
  "Test upload completed successfully",
  {
    type: "object",
    properties: {
      url: {
        type: "string",
        format: "uri",
        description: "URL of the uploaded demo image.",
        example:
          "https://res.cloudinary.com/demo/image/upload/v1/portfolio-test/sample.jpg",
      },
    },
    required: ["url"],
  }
);

const deleteImageInputSchema: SchemaObject = {
  type: "object",
  description: "Payload for deleting a Cloudinary asset.",
  properties: {
    publicId: {
      type: "string",
      description: "Cloudinary public id of the asset to delete.",
      example: "portfolio/abc",
    },
  },
  required: ["publicId"],
};

export const uploadSchemas: Record<string, SchemaObject | ReferenceObject> = {
  UploadFileResponse: uploadFileResponseSchema,
  UploadHealthResponse: uploadHealthResponseSchema,
  UploadDeleteResponse: uploadDeleteResponseSchema,
  UploadTestResponse: uploadTestResponseSchema,
  DeleteImageInput: deleteImageInputSchema,
};