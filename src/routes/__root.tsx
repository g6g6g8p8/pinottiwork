import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import socialShareAsset from "../assets/social-share.png.asset.json";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SearchProvider } from "../context/SearchContext";
import Sidebar from "../components/portfolio/Sidebar";
import BottomTabBar from "../components/portfolio/BottomTabBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-foreground/60">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Giulio Pinotti, Creative Director" },
      { name: "description", content: "Creative Director based in São Paulo, Brazil — branding, content, advertising, and design." },
      { name: "author", content: "Giulio Pinotti" },
      { property: "og:title", content: "Giulio Pinotti, Creative Director" },
      { property: "og:description", content: "Creative Director based in São Paulo, Brazil — branding, content, advertising, and design." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Giulio Pinotti, Creative Director" },
      { name: "twitter:description", content: "Creative Director based in São Paulo, Brazil — branding, content, advertising, and design." },
      { property: "og:image", content: `https://pinotti.work${socialShareAsset.url}` },
      { name: "twitter:image", content: `https://pinotti.work${socialShareAsset.url}` },
      { property: "og:site_name", content: "Giulio Pinotti" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Giulio Pinotti",
          jobTitle: "Creative Director",
          url: "https://pinottiwork.lovable.app",
          address: {
            "@type": "PostalAddress",
            addressLocality: "São Paulo",
            addressCountry: "BR",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideSidebar = pathname.startsWith("/about") || pathname.startsWith("/projects/");

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <div className="min-h-screen bg-background text-foreground">
          <div className="flex max-w-[1400px] mx-auto">
            {!hideSidebar && <Sidebar />}
            <main className="flex-1 min-w-0 pb-[100px] lg:pb-0">
              <Outlet />
            </main>
          </div>
          <BottomTabBar />
        </div>
      </SearchProvider>
    </QueryClientProvider>
  );
}
