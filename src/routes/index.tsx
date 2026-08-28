import { createFileRoute } from "@tanstack/react-router";
import Home from "../components/portfolio/Home";
import socialShareAsset from "../assets/social-share.png.asset.json";

const SITE = "https://pinotti.work";
const OG_IMAGE = socialShareAsset.url;

const SEO = {
  en: {
    title: "Giulio Pinotti | Creative Director Portfolio",
    description:
      "Portfolio of Giulio Pinotti, Creative Director — branding, content, advertising and design based in São Paulo, Brazil.",
  },
  pt: {
    title: "Giulio Pinotti | Portfólio de Diretor de Criação",
    description:
      "Portfólio de Giulio Pinotti, Diretor de Criação — branding, conteúdo, publicidade e design, com base em São Paulo.",
  },
};

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const s = SEO[match.context.locale];
    return {
    meta: [
      { title: s.title },
      {
        name: "description",
        content: s.description,
      },
      { property: "og:title", content: s.title },
      {
        property: "og:description",
        content: s.description,
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
        href: "https://assets.pinotti.work/assets-v1/cde1f0aa-0b9d-4e82-8785-5791b785100a/15-b_zhcxb5.png?cb=1",
        fetchpriority: "high",
      },
    ],
    };
  },
  component: Home,
});
