import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "~/utils/trpc";

export const Route = createFileRoute("/")({
  component: IndexComponent,
  loader: async (c) => {
    // This is important because it populates the server side
    // Trpc query for hydration.
    c.context.queryUtils.testRoute.ensureData();
  },
});

function IndexComponent() {
  const test = trpc.testRoute.useSuspenseQuery();

  return (
    <div>
      {test[0]}
      <h2>Home</h2>

      <p>
        This home route simply loads some data (with a simulated delay) and
        displays it.
      </p>
    </div>
  );
}
