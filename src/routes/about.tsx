import { createFileRoute } from "@tanstack/react-router";
import About from "../components/portfolio/About";
import socialShareAsset from "../assets/social-share.png.asset.json";

const SITE = "https://pinotti.work";
const OG_IMAGE = `${SITE}${socialShareAsset.url}`;

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
          jobTitle: "Creative Director",
          headline: "Creative Director based in São Paulo",
          description:
            "Creative Director working across branding, content, advertising and design, with a career across Mary Kay, Mastercard and more.",
          image: OG_IMAGE,
          address: {
            "@type": "PostalAddress",
            addressLocality: "São Paulo",
            addressCountry: "BR",
          },
        }),
      },
    ],
  }),
  component: About,
});
