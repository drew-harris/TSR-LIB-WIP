import { publicProcedure, router } from "./base";
export const appRouter = router({
  testRoute: publicProcedure.query(async () => {
    // Get random number and add to end of the string
    // Wait 5 seconds
    const random = Math.floor(Math.random() * 100);
    return "Drew Was Here" + random;
  }),

  // ...
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
