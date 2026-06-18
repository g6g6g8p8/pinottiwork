import { createFileRoute } from '@tanstack/react-router';
import ProjectList from '../components/portfolio/ProjectList';
import socialShareAsset from '../assets/social-share.png.asset.json';

const SITE = 'https://pinotti.work';
const OG_IMAGE = `${SITE}${socialShareAsset.url}`;

export const Route = createFileRoute('/clients/$client')({
  head: ({ params }) => {
    const name = (params.client || '').replace(/-/g, ' ');
    const title = `Projects for ${name} — Giulio Pinotti`;
    const description = `Selected work by Giulio Pinotti, Creative Director based in São Paulo, for ${name} — branding, content, advertising and design.`;
    const url = `${SITE}/clients/${params.client}`;
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
    const { client } = Route.useParams();
    return <ProjectList kind="client" slug={client} />;
  },
});
