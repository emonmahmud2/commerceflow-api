import cors from "cors";
import express from "express";
import * as helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { loadOpenApiSpec } from "./config/swagger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(helmet.default());
  app.use(
    cors({
      origin: env.corsOrigin === "*" ? true : env.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ success: true, message: "ok" });
  });

  const openApiSpec = loadOpenApiSpec();
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, { customSiteTitle: "Order API Docs" })
  );

  app.use("/api", apiRouter);
  app.use(notFound);
  app.use(errorMiddleware);

  return app;
}
