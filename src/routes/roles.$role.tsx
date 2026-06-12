import { createFileRoute } from '@tanstack/react-router';
import ProjectList from '../components/portfolio/ProjectList';

const SITE = 'https://pinottiwork.lovable.app';

export const Route = createFileRoute('/roles/$role')({
  head: ({ params }) => {
    const name = (params.role || '').replace(/-/g, ' ');
    const title = `${name} projects — Giulio Pinotti`;
    const description = `Selected work by Giulio Pinotti in the role of ${name}.`;
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: `${SITE}/roles/${params.role}` },
      ],
      links: [{ rel: 'canonical', href: `${SITE}/roles/${params.role}` }],
    };
  },
  component: () => {
    const { role } = Route.useParams();
    return <ProjectList kind="role" slug={role} />;
  },
});
