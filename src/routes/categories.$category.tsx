import { createFileRoute } from '@tanstack/react-router';
import ProjectList from '../components/portfolio/ProjectList';
import socialShareAsset from '../assets/social-share.png.asset.json';

const SITE = 'https://pinotti.work';
const OG_IMAGE = `${SITE}${socialShareAsset.url}`;

export const Route = createFileRoute('/categories/$category')({
  head: ({ params }) => {
    const name = (params.category || '').replace(/-/g, ' ');
    const title = `${name} — Giulio Pinotti`;
    const description = `Explore selected ${name} projects by Giulio Pinotti, Creative Director based in São Paulo — branding, content, advertising and design.`;
    const url = `${SITE}/categories/${params.category}`;
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { property: 'og:image', content: OG_IMAGE },
        { name: 'twitter:image', content: OG_IMAGE },
      ],
      links: [{ rel: 'canonical', href: url }],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': url,
            url,
            headline: name,
            name: title,
            description,
            isPartOf: { '@type': 'WebSite', url: SITE, name: 'Giulio Pinotti' },
          }),
        },
      ],
    };
  },
  component: () => {
    const { category } = Route.useParams();
    return <ProjectList kind="category" slug={category} />;
  },
});
