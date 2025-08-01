import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import type { ViteDevServer } from "vite";
import type { ServerBuild } from "@remix-run/node";
import { initializeDatabase } from "./app/lib/mongodb.server.js";

const viteDevServer: ViteDevServer | undefined =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () =>
        viteDevServer.ssrLoadModule(
          "virtual:remix/server-build"
        ) as Promise<ServerBuild>
    : // @ts-expect-error - API routes without default exports are valid but cause type issues
      ((await import("./build/server/index.js").catch(() => {
        throw new Error(
          "Production build not found. Run 'npm run build:all' first."
        );
      })) as ServerBuild),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

const port: string | number = process.env.PORT || 3000;

// Initialize database connection before starting server
async function startServer() {
  try {
    await initializeDatabase();
    console.log("Database initialized successfully");

    app.listen(port, () =>
      console.log(`Express server listening at http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

startServer();
