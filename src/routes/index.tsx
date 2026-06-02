import { createFileRoute } from "@tanstack/react-router";
import Home from "../components/portfolio/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Giulio Pinotti, Creative Director" },
      { name: "description", content: "Portfolio of Giulio Pinotti — Creative Director based in São Paulo, Brazil. Branding, content, advertising and design." },
      { property: "og:title", content: "Giulio Pinotti, Creative Director" },
      { property: "og:description", content: "Selected work in branding, content, advertising and design." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});
