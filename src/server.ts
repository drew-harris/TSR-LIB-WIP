import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server"; // Deno 'npm:@hono/trpc-server'
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { appRouter } from "./trpc/app";
import { handlePage } from "./internal/serverPageHandler";

const server = new Hono()
  .use("/assets/*", serveStatic({ root: "./dist/public" }))
  .use("/favicon.ico", serveStatic({ path: "./dist/public/favicon.ico" }))

  .use(
    "/trpc/*",
    trpcServer({
      router: appRouter,
    }),
  )

  // Free to use this hono server for whatever you want (redirect urls, etc)

  .get("*", handlePage);

if (import.meta.env.PROD) {
  const port = Number(process.env["PORT"] || 3000);
  serve(
    {
      port,
      fetch: server.fetch,
    },
    () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    },
  );
}

export default server;
