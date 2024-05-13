import { createRouter as baseCreateRouter } from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CreateQueryUtils } from "@trpc/react-query/shared";
import { AppRouter } from "../trpc/app";
import { routeTree } from "./routeTree.gen";
import { trpc } from "./trpc";

export type RootRouterContext = {
  headTags?: () => React.ReactNode;
  bodyTags?: () => React.ReactNode;
  trpc: CreateQueryUtils<AppRouter>;
  // OTHER STUFF LIKE AUTH STATE CAN GO HERE!!!
};

// POISON DO NOT TOUCH!!!
// export type CreateRouterParams = Parameters<typeof baseCreateRouter>[0] & {
//   context: RootRouterContext;
// };

export const createRouter = (
  opts: {
    context: RootRouterContext;
    [k: string]: any;
  },
  queryClient: QueryClient,
  trpcClient: ReturnType<typeof trpc.createClient>,
) => {
  return baseCreateRouter({
    routeTree,
    defaultPreload: "intent",
    ...opts,
    Wrap({ children }: any) {
      if (!opts.context) {
        return children;
      }
      return (
        <QueryClientProvider client={queryClient}>
          <trpc.Provider queryClient={queryClient} client={trpcClient}>
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
