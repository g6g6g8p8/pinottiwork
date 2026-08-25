import { createFileRoute } from "@tanstack/react-router";
import Home from "../components/portfolio/Home";
import socialShareAsset from "../assets/social-share.png.asset.json";

const SITE = "https://pinotti.work";
const OG_IMAGE = socialShareAsset.url;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Giulio Pinotti | Creative Director Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Giulio Pinotti, Creative Director — branding, content, advertising and design based in São Paulo, Brazil.",
      },
      { property: "og:title", content: "Giulio Pinotti | Creative Director Portfolio" },
      {
        property: "og:description",
        content:
          "Portfolio of Giulio Pinotti, Creative Director — branding, content, advertising and design based in São Paulo, Brazil.",
      },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/` },
      {
        rel: "preload",
        as: "image",
        href: "https://assets.pinotti.work/assets-v1/cde1f0aa-0b9d-4e82-8785-5791b785100a/15-b_zhcxb5.png",
        fetchpriority: "high",
      },
    ],
  }),
  component: Home,
});
