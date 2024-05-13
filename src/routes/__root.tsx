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

import type { RootRouterContext } from "~/internal/router";

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
        <div className="border-b flex p-5 gap-5">
          <Link preload="intent" to="/" className="[&.active]:font-bold">
            Home
          </Link>

          <Link preload="intent" to="/slow" className="[&.active]:font-bold">
            Slow Data
          </Link>

          <Link to="/fast" preload="intent" className="[&.active]:font-bold">
            Fast Data
          </Link>
        </div>

        <div className="p-5">
          <Outlet />
        </div>

        {/* {import.meta.env.DEV && ( */}
        {/*   <> */}
        {/*     <TanStackRouterDevtools /> */}
        {/*     <ReactQueryDevtools /> */}
        {/*   </> */}
        {/* )} */}

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
