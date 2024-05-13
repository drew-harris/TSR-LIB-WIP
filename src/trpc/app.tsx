import { publicProcedure, router } from "./base";
import { todoRouter } from "./todos";

export const appRouter = router({
  todos: todoRouter,
  fastData: publicProcedure.query(async () => {
    // Pause for 350 milliseconds
    await new Promise((resolve) => setTimeout(resolve, 250));
    return "Fast data here";
  }),

  slowData: publicProcedure.query(async () => {
    // Pause for 1-2 seconds
    const timeOut = Math.random() * 1000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, timeOut));
    return "Slow data";
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
