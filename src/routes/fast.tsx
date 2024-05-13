import { createFileRoute } from "@tanstack/react-router";

// Alternate way of pre-rendering on the server/client before nav

export const Route = createFileRoute("/fast")({
  loader: async ({ context: { trpc } }) => {
    return {
      fastData: await trpc.fastData.fetch(),
    };
  },

  // If loading takes more than 1 second, this will be shown
  // however it will never flash
  pendingComponent: () => <p>Loading...</p>,

  errorComponent: ({ error }: any) => (
    <p>Error: {error?.message || "There was an error fetching ur data"}</p>
  ),

  component: () => {
    const { fastData } = Route.useLoaderData();
    return <p>{fastData}</p>;
  },
});
