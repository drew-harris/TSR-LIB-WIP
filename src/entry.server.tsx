import { renderAssets } from "@ssrx/react/server";
import { assetsForRequest } from "@ssrx/vite/runtime";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory } from "@tanstack/react-router";
import { observable } from "@trpc/server/observable";
import { createRouter } from "~/router.tsx";
import { trpc } from "./utils/trpc";
import { TRPCClientError, httpBatchLink } from "@trpc/client";
import { callProcedure } from "@trpc/server";
import { appRouter } from "./trpc/app";
import { TRPCErrorResponse } from "@trpc/server/unstable-core-do-not-import";
import { createTRPCQueryUtils } from "@trpc/react-query";

const createContext = async () => {
  return {};
};

export async function render(req: Request) {
  const assets = await assetsForRequest(req.url);

  // Build trpc
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      () =>
        ({ op }) =>
          observable((observer) => {
            createContext()
              .then((ctx) => {
                return callProcedure({
                  procedures: appRouter._def.procedures,
                  path: op.path,
                  getRawInput: async () => op.input,
                  input: op.input,
                  ctx,
                  type: op.type,
                });
              })
              .then((data) => {
                observer.next({ result: { data } });
                observer.complete();
              })
              .catch((cause: TRPCErrorResponse) => {
                observer.error(TRPCClientError.from(cause));
              });
          }),
    ],
  });

  const queryUtils = createTRPCQueryUtils({
    queryClient,
    client: trpcClient,
  });

  const router = createRouter({
    context: {
      headTags: () => renderAssets(assets.headAssets),
      bodyTags: () => renderAssets(assets.bodyAssets),
      queryClient,
      trpcClient,
      queryUtils,
    },

    dehydrate: () => {
      return {
        queryClient: dehydrate(queryClient),
      };
    },
  });

  const url = new URL(req.url);
  const memoryHistory = createMemoryHistory({
    initialEntries: [url.pathname + url.search],
  });

  router.update({ history: memoryHistory });

  // Wait for critical, non-deferred data
  await router.load();

  const app = <RouterProvider router={router} />;

  return { app, router };
}
