import { createFileRoute, Await, defer } from "@tanstack/react-router";
import { Suspense } from "react";
import { trpc } from "~/internal/trpc";

// 2 Methods to fetch data that takes a long time

export const Route = createFileRoute("/slow")({
  component: AdminHome,
  loader: async ({ context }) => {
    const slowData = context.trpc.slowData.fetch();
    return {
      slowData: defer(slowData),
    };
  },
});

function AdminHome() {
  const { slowData } = Route.useLoaderData();
  const superSlow = trpc.slowData.useQuery();

  return (
    <>
      <h1>Suspense</h1>
      <Suspense fallback={<p>Loading deferred...</p>}>
        <Await promise={slowData}>{(data) => <p>{data}</p>}</Await>
      </Suspense>

      <h1>useQuery</h1>
      {superSlow.status === "pending" && <p>Loading...</p>}
      {superSlow.status === "success" && <p>{superSlow.data}</p>}

      <div>
        Hovering over the links in the navbar will pre-fetch the data for
        everything except the deferred suspense version
      </div>
    </>
  );
}
