import "./__root.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  createRootRouteWithContext,
  ErrorComponent,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// @ts-expect-error no types
import jsesc from "jsesc";

import type { RootRouterContext } from "~/router.ts";

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: RootComponent,
  errorComponent: RootErrorComponent,
});

function RootComponent() {
  const router = useRouter();
  const { bodyTags, headTags } = router.options.context;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {headTags?.()}
      </head>

      <body className="bg-black text-white">
        <div className="root-nav">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>

          <Link to="/lazy-component" className="[&.active]:font-bold">
            Lazy Component
          </Link>

          <Link to="/redirect" className="[&.active]:font-bold">
            Redirect
          </Link>

          <Link to="/admin" className="[&.active]:font-bold">
            Admin
          </Link>
        </div>

        <hr />

        <div className="root-content">
          <Outlet />
        </div>

        <TanStackRouterDevtools />
        <ReactQueryDevtools />

        {bodyTags?.()}
        <DehydrateRouter />
      </body>
    </html>
  );
}

function RootErrorComponent({ error }: ErrorComponentProps) {
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }

  return <ErrorComponent error={error} />;
}

export function DehydrateRouter() {
  const router = useRouter();

  const dehydrated = router.dehydratedData || {
    router: router.dehydrate(),
    payload: router.options.dehydrate?.(),
  };

  const stringified = jsesc(router.options.transformer.stringify(dehydrated), {
    isScriptContext: true,
    wrap: true,
  });

  return (
    <script
      id="__TSR_DEHYDRATED__"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          window.__TSR_DEHYDRATED__ = {
            data: ${stringified}
          }
        `,
      }}
    />
  );
}
