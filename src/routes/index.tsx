import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "~/utils/trpc";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const [test] = trpc.testRoute.useSuspenseQuery();

  return <div>Server fetched data: {test}</div>;
}
