import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
  loader: async ({ context }) => {
    return {
      testData: await context.queryUtils.testRoute.fetch(),
    };
  },
});

function AdminHome() {
  const { testData } = Route.useLoaderData();
  return <p>Admin home..{testData}</p>;
}
