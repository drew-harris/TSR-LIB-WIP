import { createRouter as baseCreateRouter } from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateQueryUtils, TRPCQueryUtils } from "@trpc/react-query/shared";
import { routeTree } from "./routeTree.gen";
import { AppRouter } from "./trpc/app";
import { trpc } from "./utils/trpc";

export type RootRouterContext = {
  headTags?: () => React.ReactNode;
  bodyTags?: () => React.ReactNode;
  queryClient: QueryClient;
  trpcClient: ReturnType<typeof trpc.createClient>;
  queryUtils: CreateQueryUtils<AppRouter>;
};

export type CreateRouterParams = Parameters<typeof baseCreateRouter>[0] & {
  context: RootRouterContext;
};

export const createRouter = (opts: {
  context: RootRouterContext;
  // TODO: add more
  [k: string]: any;
}) => {
  return baseCreateRouter({
    routeTree,
    defaultPreload: "intent",
    ...opts,
    Wrap({ children }) {
      if (!opts.context) {
        return children;
      }
      return (
        <QueryClientProvider client={opts.context.queryClient}>
          <trpc.Provider
            queryClient={opts.context.queryClient}
            client={opts.context.trpcClient}
          >
            {children}
          </trpc.Provider>
        </QueryClientProvider>
      );
    },
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
