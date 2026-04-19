import cors from "cors";
import express, { type RequestHandler } from "express";
import * as helmet from "helmet";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { loadOpenApiSpec } from "./config/swagger.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { apiRouter } from "./routes/index.js";

/** Helmet's package types mis-resolve under `NodeNext` on some installs (TS2349). */
const helmetMiddleware = helmet.default as unknown as () => RequestHandler;

let mongoConnect: Promise<typeof mongoose> | undefined;

function ensureMongo(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }
  mongoConnect ??= mongoose.connect(env.mongoUri);
  return mongoConnect;
}

export function createApp() {
  const app = express();

  // Vercel runs this file without `index.ts`; connect before API routes.
  app.use((req, res, next) => {
    if (req.path === "/health") {
      next();
      return;
    }
    void ensureMongo().then(() => next()).catch(next);
  });

  app.use(helmetMiddleware());
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

/** Vercel (Express preset) requires a default export of the `Application` or a server. */
const app = createApp();
export default app;
