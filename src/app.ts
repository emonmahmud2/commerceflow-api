import cors from "cors";
import express, { type RequestHandler } from "express";
import * as helmet from "helmet";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import { loadOpenApiSpec } from "./config/swagger.js";
import { swaggerUiCdnPageHtml, swaggerUiInitScript } from "./config/swaggerUiCdn.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { apiRouter } from "./routes/index.js";

type HelmetCsp = { getDefaultDirectives: () => Record<string, Iterable<string>> };

/** Helmet's default export typing mis-resolves under `NodeNext` on some installs (TS2349). */
const helmetInstall = helmet.default as unknown as (opts?: Record<string, unknown>) => RequestHandler;

const cspDirectives: Record<string, Iterable<string>> = {
  ...(helmet as unknown as { contentSecurityPolicy: HelmetCsp }).contentSecurityPolicy.getDefaultDirectives(),
};
// Defaults already use "script-src" / "style-src" keys; do not add camelCase keys (Helmet sees duplicates).
cspDirectives["script-src"] = ["'self'", "https://cdn.jsdelivr.net"];

const helmetMiddleware = helmetInstall({
  contentSecurityPolicy: {
    directives: cspDirectives,
  },
});

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
    if (req.path === "/health" || req.path.startsWith("/api-docs")) {
      next();
      return;
    }
    void ensureMongo().then(() => next()).catch(next);
  });

  app.use(helmetMiddleware);
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
  const openApiSpecUrl = "/api-docs/openapi.json";

  app.get(openApiSpecUrl, (_req, res) => {
    res.json(openApiSpec);
  });
  app.get("/api-docs/ui-init.js", (_req, res) => {
    res.type("application/javascript").send(swaggerUiInitScript(openApiSpecUrl));
  });
  app.get(["/api-docs", "/api-docs/"], (_req, res) => {
    res.type("html").send(swaggerUiCdnPageHtml());
  });

  app.use("/api", apiRouter);
  app.use(notFound);
  app.use(errorMiddleware);

  return app;
}

/** Vercel (Express preset) requires a default export of the `Application` or a server. */
const app = createApp();
export default app;
