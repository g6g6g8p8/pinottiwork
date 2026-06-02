import { createFileRoute } from "@tanstack/react-router";
import ProjectDetail from "../components/portfolio/ProjectDetail";
import { getProjectMeta } from "../lib/project-meta.functions";

const SITE = "https://pinottiwork.lovable.app";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const meta = await getProjectMeta({ data: { slug: params.slug } });
    return { meta };
  },
  head: ({ params, loaderData }) => {
    const meta = loaderData?.meta;
    const url = `${SITE}/projects/${params.slug}`;
    const title = meta
      ? `${meta.title} — Giulio Pinotti`
      : `${params.slug.replace(/-/g, " ")} — Giulio Pinotti`;
    const baseDesc = meta?.description?.trim() || "";
    const ctx = meta?.client ? `${meta.client}${meta.role ? ` · ${meta.role}` : ""}. ` : "";
    let description = (ctx + baseDesc).trim();
    if (description.length > 300) description = description.slice(0, 297) + "…";
    if (!description) description = "Selected project by Giulio Pinotti, Creative Director.";

    const meta_tags: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
    ];
    if (meta?.hero && !/\.(mp4|mov)$/i.test(meta.hero)) {
      meta_tags.push({ property: "og:image", content: meta.hero });
      meta_tags.push({ name: "twitter:image", content: meta.hero });
    }

    const scripts = meta
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              headline: meta.title,
              name: meta.title,
              description: baseDesc || description,
              image: meta.hero,
              url,
              creator: {
                "@type": "Person",
                name: "Giulio Pinotti",
                jobTitle: "Creative Director",
                url: SITE,
              },
              ...(meta.client ? { sourceOrganization: { "@type": "Organization", name: meta.client } } : {}),
              ...(meta.category ? { genre: meta.category } : {}),
            }),
          },
        ]
      : [];

    return {
      meta: meta_tags,
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  component: ProjectDetail,
});
