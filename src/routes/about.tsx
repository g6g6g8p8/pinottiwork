import { createFileRoute } from "@tanstack/react-router";
import About from "../components/portfolio/About";

const SITE = "https://pinottiwork.lovable.app";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Giulio Pinotti — Creative Director in São Paulo" },
      {
        name: "description",
        content:
          "Giulio Pinotti is a Creative Director based in São Paulo: career across Mary Kay, Mastercard and more, plus brands, awards and selected highlights.",
      },
      { property: "og:title", content: "About Giulio Pinotti — Creative Director in São Paulo" },
      {
        property: "og:description",
        content:
          "Career, brands and awards of Giulio Pinotti — Creative Director working across branding, content, advertising and design.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: `${SITE}/about` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/about` }],
  }),
  component: About,
});
