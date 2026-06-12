import { createFileRoute } from '@tanstack/react-router';
import ProjectList from '../components/portfolio/ProjectList';

const SITE = 'https://pinottiwork.lovable.app';

export const Route = createFileRoute('/clients/$client')({
  head: ({ params }) => {
    const name = (params.client || '').replace(/-/g, ' ');
    const title = `Projects for ${name} — Giulio Pinotti`;
    const description = `Selected work by Giulio Pinotti for ${name}.`;
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: `${SITE}/clients/${params.client}` },
      ],
      links: [{ rel: 'canonical', href: `${SITE}/clients/${params.client}` }],
    };
  },
  component: () => {
    const { client } = Route.useParams();
    return <ProjectList kind="client" slug={client} />;
  },
});
