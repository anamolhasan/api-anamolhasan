import express, { Application } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { ApiRoutes } from "./app/routes/index.js";
import notFoundHandler from "./app/middlewares/not-found.js";
import globalErrorHandler from "./app/middlewares/error-handler.js";
import { setupSwagger } from "./app/docs/index.js";
import { envVars } from "./app/config/env.js";

const app: Application = express();

app.set("query parser", "extended");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware({
    publishableKey: envVars.CLERK.CLERK_PUBLISHABLE_KEY,
    secretKey: envVars.CLERK.CLERK_SECRET_KEY,
  }),
);

app.use(
  cors({
    origin: envVars.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

if (envVars.SWAGGER.SWAGGER_ENABLED) {
  setupSwagger(app);
}

app.use("/api/v1", ApiRoutes);

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;