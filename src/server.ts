import { serve } from "@hono/node-server";
import { stream } from "hono/streaming";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import * as entry from "~/entry.server.tsx";
import { drewsRenderToStream } from "./streamer";

const server = new Hono()
  .use("/assets/*", serveStatic({ root: "./dist/public" }))
  .use("/favicon.ico", serveStatic({ path: "./dist/public/favicon.ico" }))
  .get("*", async (c) => {
    c.header("Content-Type", "text/html; charset=utf-8");
    return stream(c, async (stream) => {
      try {
        const { app, router } = await entry.render(c.req.raw);
        const { stream: ssrxStream, statusCode } = await drewsRenderToStream({
          app: () => app,
          req: c.req.raw,
          injectToStream: [
            {
              async emitBeforeStreamChunk() {
                const injectorPromises = router.injectedHtml.map((d) =>
                  typeof d === "function" ? d() : d,
                );
                const injectors = await Promise.all(injectorPromises);
                router.injectedHtml = [];
                return injectors.join("");
              },
            },
          ],
        });

        let status = statusCode();
        if (router.hasNotFoundMatch() && status !== 500) status = 404;

        // Set the headers directly on the context
        c.header("Content-Type", "text/html; charset=utf-8");

        stream.onAbort(() => {
          if (!ssrxStream.locked) {
            ssrxStream.cancel();
          }
        });

        if (ssrxStream.locked) {
          console.error("Stream is locked, cannot proceed with operations");
          return;
        }

        const response = new Response(ssrxStream, { status });

        if (response.body) {
          await stream.pipe(response.body).catch((err) => {
            console.error("Error during stream operation:", err);
            if (!ssrxStream.locked) {
              ssrxStream.cancel();
            }
          });
        }
      } catch (err) {
        console.error("Server-side rendering failed:", err);
        throw err; // Rethrow to let Hono handle the error
      }
    });
  });

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
