import { createRouter as baseCreateRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

export type RootRouterContext = { headTags?: () => React.ReactNode; bodyTags?: () => React.ReactNode };

export type CreateRouterParams = Parameters<typeof baseCreateRouter>[0] & { context?: RootRouterContext };

export const createRouter = (opts: CreateRouterParams = {}) => {
  // Create fresh trpc context here...
  return baseCreateRouter({ routeTree, defaultPreload: 'intent', ...opts });
};

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
