import http from "http";
import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./app/config/database.js";
import { envVars } from "./app/config/env.js";

const server = http.createServer(app);

async function bootstrap(): Promise<void> {
  try {
    // Do not start serving requests unless MongoDB is reachable.
    await connectDatabase();

    server.listen(envVars.PORT, () => {
      console.log(
        `Server is running on http://localhost:${envVars.PORT} (${envVars.NODE_ENV})`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void bootstrap();

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  });
}
