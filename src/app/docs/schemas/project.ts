import type { ReferenceObject, SchemaObject } from "openapi3-ts/oas30";
import { schemaRef, successEnvelope } from "./common.js";

const projectIdExample = "661e6df9c4a4a3001f2a3b4c";

const projectLinkSchema: SchemaObject = {
  type: "object",
  properties: {
    label: {
      type: "string",
      minLength: 1,
      description: "Link label.",
      example: "Live demo",
    },
    url: {
      type: "string",
      minLength: 1,
      description: "Link URL.",
      example: "https://example.com",
    },
  },
  required: ["label", "url"],
};

const projectStatusSchema: SchemaObject = {
  type: "string",
  enum: ["published", "draft", "archived"],
  description: "Publication status of the project.",
  example: "published",
};

const projectSchema: SchemaObject = {
  type: "object",
  description: "A portfolio project document as stored in MongoDB.",
  properties: {
    _id: {
      type: "string",
      description: "MongoDB document identifier (ObjectId).",
      pattern: "^[a-f0-9]{24}$",
      example: projectIdExample,
    },
    title: {
      type: "string",
      maxLength: 100,
      description: "Project title.",
      example: "Anamol Hasan Portfolio",
    },
    slug: {
      type: "string",
      description: "SEO-friendly URL slug.",
      example: "anamol-hasan-portfolio",
    },
    shortDescription: {
      type: "string",
      maxLength: 200,
      description: "One-line project summary.",
      example: "Portfolio site built with Next.js and this API.",
    },
    thumbnail: {
      type: "string",
      format: "uri",
      description: "Primary image URL (hosted on Cloudinary).",
      example:
        "https://res.cloudinary.com/demo/image/upload/v1/portfolio/thumb.jpg",
    },
    category: {
      type: "string",
      description: "Project category.",
      example: "Full Stack",
    },
    featured: {
      type: "boolean",
      description: "Whether the project is featured on the portfolio.",
      example: false,
    },
    status: projectStatusSchema,
    description: {
      type: "string",
      description: "Long-form project description.",
      example: "A full-stack portfolio showcasing projects built over the years.",
    },
    images: {
      type: "array",
      items: {
        type: "string",
        format: "uri",
      },
      description: "Gallery image URLs.",
    },
    liveLinks: {
      type: "array",
      items: schemaRef("ProjectLink"),
      description: "Links to the live project.",
    },
    sourceCodes: {
      type: "array",
      items: schemaRef("ProjectLink"),
      description: "Links to the source code.",
    },
    technologies: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Technologies used.",
      example: ["React", "Node.js"],
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Creation timestamp.",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      description: "Last update timestamp.",
    },
  },
  required: [
    "_id",
    "title",
    "description",
    "images",
    "technologies",
    "createdAt",
    "updatedAt",
  ],
};

const projectInputProperties: Record<string, SchemaObject | ReferenceObject> = {
  title: {
    type: "string",
    minLength: 1,
    maxLength: 100,
    description: "Project title (required).",
    example: "Anamol Hasan Portfolio",
  },
  slug: {
    type: "string",
    description:
      "Optional URL slug; populated later by the client when a custom one is desired.",
    example: "anamol-hasan-portfolio",
  },
  shortDescription: {
    type: "string",
    maxLength: 200,
    description: "One-line project summary.",
  },
  thumbnail: {
    type: "string",
    format: "uri",
    description: "Primary image URL (hosted on Cloudinary).",
  },
  category: {
    type: "string",
    description: "Project category.",
    example: "Full Stack",
  },
  featured: {
    type: "boolean",
    description: "Whether to feature the project.",
    example: false,
  },
  status: projectStatusSchema,
  description: {
    type: "string",
    minLength: 1,
    description: "Long-form project description (required).",
  },
  images: {
    type: "array",
    items: {
      type: "string",
      format: "uri",
    },
    minItems: 1,
    description: "Gallery image URLs (at least one required).",
  },
  liveLinks: {
    type: "array",
    items: schemaRef("ProjectLink"),
    description: "Links to the live project.",
  },
  sourceCodes: {
    type: "array",
    items: schemaRef("ProjectLink"),
    description: "Links to the source code.",
  },
  technologies: {
    type: "array",
    items: {
      type: "string",
    },
    minItems: 1,
    description: "Technologies used (at least one required).",
  },
};

const createProjectInputSchema: SchemaObject = {
  type: "object",
  description:
    "Payload for creating a project. Mirrors ProjectValidation.createProjectZodSchema.",
  properties: projectInputProperties,
  required: ["title", "description", "images", "technologies"],
};

const updateProjectInputSchema: SchemaObject = {
  type: "object",
  description:
    "Payload for updating a project. Mirrors ProjectValidation.updateProjectZodSchema (all fields optional).",
  properties: projectInputProperties,
};

const projectListResponseSchema: SchemaObject = successEnvelope(
  "Projects fetched successfully",
  {
    type: "array",
    items: schemaRef("Project"),
  },
  schemaRef("PaginationMeta")
);

const projectResponseSchema: SchemaObject = successEnvelope(
  "Project operation completed successfully",
  schemaRef("Project")
);

const projectDeleteResponseSchema: SchemaObject = successEnvelope(
  "Project deleted successfully"
);

export const projectSchemas: Record<string, SchemaObject | ReferenceObject> = {
  ProjectLink: projectLinkSchema,
  Project: projectSchema,
  CreateProjectInput: createProjectInputSchema,
  UpdateProjectInput: updateProjectInputSchema,
  ProjectListResponse: projectListResponseSchema,
  ProjectResponse: projectResponseSchema,
  ProjectDeleteResponse: projectDeleteResponseSchema,
};