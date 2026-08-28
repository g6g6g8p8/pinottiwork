import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    // `locale` is a placeholder here — the root route's `beforeLoad` always
    // resolves and overrides it before anything renders.
    context: { queryClient, locale: "en" as const },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
