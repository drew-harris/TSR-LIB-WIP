import { Context } from "hono";
import * as entry from "~/internal/entry.server";
import { stream } from "hono/streaming";
import { drewsRenderToStream } from "./streamer";

export const handlePage = async (c: Context) => {
  c.header("Content-Type", "text/html; charset=utf-8");
  return stream(c, async (stream) => {
    try {
      const { app, router } = await entry.render(c.req.raw);
      // TODO: Getting closer
      // if (router.history.location.href != c.req.raw.url) {
      //   console.log("Redirecting to", router.history.location.href);
      //   // c.redirect(router.history.location.href);
      //   // return;
      // }
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
};
