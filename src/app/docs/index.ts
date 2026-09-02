import { Application } from "express";
import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";
import { buildOpenApiSpec } from "./swagger.js";
import { envVars } from "../config/env.js";

const swaggerEnabled = envVars.SWAGGER.SWAGGER_ENABLED === "true";
const swaggerPath = envVars.SWAGGER.SWAGGER_PATH || "/api-docs";

const swaggerUiOptions: SwaggerUiOptions = {
  customSiteTitle: "Anamol Hasan Portfolio API — Swagger",
  explorer: false,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    tryItOutEnabled: true,
  },
};

export const setupSwagger = (app: Application): void => {
  if (!swaggerEnabled) {
    return;
  }

  const spec = buildOpenApiSpec();

  app.use(swaggerPath, swaggerUi.serve);
  app.get(swaggerPath, swaggerUi.setup(spec, swaggerUiOptions));
  app.get(`${swaggerPath}/`, (_req, res) => {
    res.redirect(swaggerPath);
  });
  app.get(`${swaggerPath}/openapi.json`, (_req, res) => {
    res.status(200).json(spec);
  });

};