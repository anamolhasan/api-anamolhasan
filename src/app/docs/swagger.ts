import type {
  ComponentsObject,
  OpenAPIObject,
  SecuritySchemeObject,
  ServerObject,
  TagObject,
} from "openapi3-ts/oas30";
import { schemas } from "./schemas/index.js";
import { paths } from "./paths/index.js";
import { envVars } from "../config/env.js";

const info: OpenAPIObject["info"] = {
  title: "Anamol Hasan Portfolio API",
  version: "1.0.0",
  description: [
    "REST API that powers the Anamol Hasan portfolio site.",
    "It serves portfolio projects and provides Cloudinary-backed image uploads.",
    "",
    "## Authentication",
    "Protected endpoints require a Clerk session token sent as a bearer token",
    "in the `Authorization` header. Click the **Authorize** button in the top-right",
    "corner and paste your token, e.g. `Authorization: Bearer <clerk-token>`.",
    "Only users with the ADMIN or SUPER_ADMIN role may mutate data.",
    "",
    "All versioned routes live under the `/api/v1` base path.",
  ].join("\n"),
  contact: {
    name: "Anamol Hasan",
  },
  license: {
    name: "ISC",
  },
};

const buildServers = (): ServerObject[] => {
  const apiBaseUrl =
    envVars.API_BASE_URL || `http://localhost:${envVars.PORT || 5000}`;
  const productionApiBaseUrl = envVars.API_BASE_URL;
  const isProduction = envVars.NODE_ENV === "production";

  const servers: ServerObject[] = [
    {
      url: apiBaseUrl,
      description: isProduction ? "Production" : "Development",
    },
  ];

  if (productionApiBaseUrl && productionApiBaseUrl !== apiBaseUrl) {
    servers.push({
      url: productionApiBaseUrl,
      description: "Production",
    });
  }

  return servers;
};

const tags: TagObject[] = [
  {
    name: "Projects",
    description: "Portfolio project management — public reads and admin CRUD.",
  },
  {
    name: "Uploads",
    description:
      "Cloudinary media operations — image upload, delete, and health checks.",
  },
  {
    name: "System",
    description: "Health and operational endpoints.",
  },
];

const bearerAuth: SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description:
    "Clerk session token. Paste the JWT issued by Clerk (from the frontend session) as `Bearer <token>`.",
};

const components: ComponentsObject = {
  schemas,
  securitySchemes: {
    bearerAuth,
  },
};

export const buildOpenApiSpec = (): OpenAPIObject => ({
  openapi: "3.0.3",
  info,
  servers: buildServers(),
  paths,
  tags,
  components,
});