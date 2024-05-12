import { publicProcedure, router } from "./base";

type Todo = {
  id: string;
  text: string;
  isComplete: boolean;
};

const getRandomId = () => Math.random().toString(36).substring(7);

export const appRouter = router({
  testRoute: publicProcedure.query(async () => {
    // Pause for 350 milliseconds
    await new Promise((resolve) => setTimeout(resolve, 350));
    return "Wow Was Here";
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
