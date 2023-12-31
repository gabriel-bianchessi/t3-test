import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { languageRouter } from "./routers/language";
import { productRouter } from "./routers/product";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  language: languageRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
