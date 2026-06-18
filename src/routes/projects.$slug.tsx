import { createFileRoute } from "@tanstack/react-router";
import ProjectDetail from "../components/portfolio/ProjectDetail";
import { getProjectMeta, type ProjectMeta } from "../lib/content.functions";

const SITE = "https://pinotti.work";

function resolveOgImage(meta: ProjectMeta | null | undefined): string | null {
  if (!meta) return null;
  if (meta.og_image) return meta.og_image;
  const hero = meta.hero || "";
  if (!hero) return null;
  const isVideo = /\.(mp4|mov)$/i.test(hero);
  if (!isVideo) return hero;
  // Derive poster from common video providers
  if (/i\.imgur\.com\//i.test(hero)) {
    return hero.replace(/\.(mp4|mov)$/i, ".jpg");
  }
  if (/res\.cloudinary\.com\/.*\/video\/upload\//i.test(hero)) {
    return hero
      .replace(/\/video\/upload\//i, "/image/upload/")
      .replace(/\.(mp4|mov)$/i, ".jpg");
  }
  return null;
}

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
    if (description.length > 160) description = description.slice(0, 157) + "…";
    if (!description) description = "Selected project by Giulio Pinotti, Creative Director.";

    const ogImage = resolveOgImage(meta);

    const meta_tags: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
    ];
    if (ogImage) {
      meta_tags.push({ property: "og:image", content: ogImage });
      meta_tags.push({ property: "og:image:alt", content: meta?.title || title });
      meta_tags.push({ name: "twitter:card", content: "summary_large_image" });
      meta_tags.push({ name: "twitter:image", content: ogImage });
      meta_tags.push({ name: "twitter:title", content: title });
      meta_tags.push({ name: "twitter:description", content: description });
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
              image: ogImage || meta.hero,
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
