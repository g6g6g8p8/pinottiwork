import { createFileRoute } from "@tanstack/react-router";
import About from "../components/portfolio/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Giulio Pinotti" },
      { name: "description", content: "About Giulio Pinotti, Creative Director — career, brands and awards." },
      { property: "og:title", content: "About — Giulio Pinotti" },
      { property: "og:description", content: "About Giulio Pinotti, Creative Director — career, brands and awards." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});
