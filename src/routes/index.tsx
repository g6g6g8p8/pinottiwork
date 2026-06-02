import { createFileRoute } from "@tanstack/react-router";
import Home from "../components/portfolio/Home";

const SITE = "https://pinottiwork.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Giulio Pinotti, Creative Director" },
      {
        name: "description",
        content:
          "Portfolio of Giulio Pinotti — Creative Director based in São Paulo, Brazil. Branding, content, advertising and design.",
      },
      { property: "og:title", content: "Giulio Pinotti — Creative Director portfolio" },
      {
        property: "og:description",
        content:
          "Selected work in branding, content, advertising and design by São Paulo-based Creative Director Giulio Pinotti.",
      },
      { property: "og:url", content: `${SITE}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
  }),
  component: Home,
});
