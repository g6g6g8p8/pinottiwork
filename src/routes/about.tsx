import { createFileRoute } from "@tanstack/react-router";
import About from "../components/portfolio/About";
import socialShareAsset from "../assets/social-share.png.asset.json";

const SITE = "https://pinotti.work";
const OG_IMAGE = socialShareAsset.url;

const SEO = {
  en: {
    title: "About Giulio Pinotti — Creative Director in São Paulo",
    description:
      "Giulio Pinotti is a Creative Director based in São Paulo: career across Mary Kay, Mastercard and more, plus brands, awards and selected highlights.",
    ogDescription:
      "Career, brands and awards of Giulio Pinotti — Creative Director working across branding, content, advertising and design.",
    jobTitle: "Creative Director",
    headline: "Creative Director based in São Paulo",
    jsonLdDescription:
      "Creative Director working across branding, content, advertising and design, with a career across Mary Kay, Mastercard and more.",
  },
  pt: {
    title: "Sobre Giulio Pinotti — Diretor de Criação em São Paulo",
    description:
      "Giulio Pinotti é Diretor de Criação com base em São Paulo: carreira em Mary Kay, Mastercard e outras marcas, além de prêmios e destaques.",
    ogDescription:
      "Carreira, marcas e prêmios de Giulio Pinotti — Diretor de Criação atuando em branding, conteúdo, publicidade e design.",
    jobTitle: "Diretor de Criação",
    headline: "Diretor de Criação com base em São Paulo",
    jsonLdDescription:
      "Diretor de Criação atuando em branding, conteúdo, publicidade e design, com carreira em Mary Kay, Mastercard e outras marcas.",
  },
};

export const Route = createFileRoute("/about")({
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
        content: s.ogDescription,
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: `${SITE}/about` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/about` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": `${SITE}/about`,
          url: `${SITE}/about`,
          name: "Giulio Pinotti",
          jobTitle: s.jobTitle,
          headline: s.headline,
          description: s.jsonLdDescription,
          image: OG_IMAGE,
          address: {
            "@type": "PostalAddress",
            addressLocality: "São Paulo",
            addressCountry: "BR",
          },
        }),
      },
    ],
    };
  },
  component: About,
});
