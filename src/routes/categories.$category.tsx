import { createFileRoute } from '@tanstack/react-router';
import ProjectList from '../components/portfolio/ProjectList';

const SITE = 'https://pinottiwork.lovable.app';

export const Route = createFileRoute('/categories/$category')({
  head: ({ params }) => {
    const name = (params.category || '').replace(/-/g, ' ');
    const title = `${name} — Giulio Pinotti`;
    const description = `Selected work by Giulio Pinotti in ${name}.`;
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: `${SITE}/categories/${params.category}` },
      ],
      links: [{ rel: 'canonical', href: `${SITE}/categories/${params.category}` }],
    };
  },
  component: () => {
    const { category } = Route.useParams();
    return <ProjectList kind="category" slug={category} />;
  },
});
