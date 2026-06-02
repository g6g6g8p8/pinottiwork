import { createFileRoute } from "@tanstack/react-router";
import ProjectDetail from "../components/portfolio/ProjectDetail";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Giulio Pinotti` },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — Giulio Pinotti` },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/projects/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/projects/${params.slug}` }],
  }),
  component: ProjectDetail,
});
