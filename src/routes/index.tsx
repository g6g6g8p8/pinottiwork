import { createFileRoute } from "@tanstack/react-router";
import Home from "../components/portfolio/Home";
import socialShareAsset from "../assets/social-share.png.asset.json";

const SITE = "https://pinotti.work";
const OG_IMAGE = `${SITE}${socialShareAsset.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Giulio Pinotti — Creative Director Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Giulio Pinotti — Creative Director based in São Paulo, Brazil. Branding, content, advertising and design.",
      },
      { property: "og:title", content: "Giulio Pinotti — Creative Director Portfolio" },
      {
        property: "og:description",
        content:
          "Selected work in branding, content, advertising and design by São Paulo-based Creative Director Giulio Pinotti.",
      },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
  }),
  component: Home,
});
