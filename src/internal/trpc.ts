import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../trpc/app";

export const trpc = createTRPCReact<AppRouter>();
