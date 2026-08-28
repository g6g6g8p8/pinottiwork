import { createFileRoute } from '@tanstack/react-router';
import ProjectList from '../components/portfolio/ProjectList';
import socialShareAsset from '../assets/social-share.png.asset.json';

const SITE = 'https://pinotti.work';
const OG_IMAGE = socialShareAsset.url;

export const Route = createFileRoute('/roles/$role')({
  head: ({ params, match }) => {
    const name = (params.role || '').replace(/-/g, ' ');
    const locale = match.context.locale;
    const title = locale === 'pt' ? `Projetos como ${name} — Giulio Pinotti` : `${name} projects — Giulio Pinotti`;
    const description =
      locale === 'pt'
        ? `Trabalho selecionado de Giulio Pinotti, Diretor de Criação com base em São Paulo, como ${name} — branding, conteúdo, publicidade e design.`
        : `Selected work by Giulio Pinotti, Creative Director based in São Paulo, in the role of ${name} — branding, content, advertising and design.`;
    const url = `${SITE}/roles/${params.role}`;
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
    const { role } = Route.useParams();
    return <ProjectList kind="role" slug={role} />;
  },
});
