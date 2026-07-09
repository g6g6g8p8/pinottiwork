import { createFileRoute, Link } from "@tanstack/react-router";
import socialShareAsset from "../assets/social-share.png.asset.json";

const SITE = "https://pinotti.work";
const URL = `${SITE}/guides/portfolio-examples`;
const OG_IMAGE = `${SITE}${socialShareAsset.url}`;

const TITLE = "10 Best Creative Director Portfolio Examples and Why They Work";
const DESCRIPTION =
  "A working Creative Director breaks down 10 portfolios that get hired — project selection, sequencing, and the case-study decisions that actually convert.";

const EXAMPLES = [
  {
    name: "Stefan Sagmeister",
    url: "https://sagmeisterwalsh.com",
    why: "Ruthless project selection. Every case leads with a strong idea in one sentence before any craft is shown.",
  },
  {
    name: "Pentagram partners",
    url: "https://www.pentagram.com",
    why: "Uniform case-study template across dozens of directors — proof that consistency of storytelling beats bespoke layouts.",
  },
  {
    name: "Jessica Walsh (&Walsh)",
    url: "https://andwalsh.com",
    why: "Opens with results and press, not process. The scroll rhythm alternates hero, insight, execution, outcome.",
  },
  {
    name: "Aaron Draplin (DDC)",
    url: "https://www.draplin.com",
    why: "Personality-forward. Voice replaces polish — a reminder that portfolios are read, not just looked at.",
  },
  {
    name: "Tobias van Schneider",
    url: "https://www.vanschneider.com",
    why: "Editorial-length case studies. Long-form works when the writing carries the craft.",
  },
  {
    name: "Bruno Simon",
    url: "https://bruno-simon.com",
    why: "One giant conceptual bet as the entire portfolio. Best-in-class demonstration that risk is the differentiator.",
  },
  {
    name: "R/GA (studio case studies)",
    url: "https://www.rga.com",
    why: "Cases open with the business problem in the client's language, then earn the reveal.",
  },
  {
    name: "Wieden+Kennedy",
    url: "https://www.wk.com",
    why: "Cultural context first, work second. Shows how CDs frame the moment before showing the artefact.",
  },
  {
    name: "Mother London",
    url: "https://motherlondon.com",
    why: "Wit as house voice. Copy on every tile does 60% of the pitch before anyone clicks in.",
  },
  {
    name: "Collins",
    url: "https://www.wearecollins.com",
    why: "Strategy-led sequencing. Rebrands are presented as decisions, not decks — a masterclass for CDs pitching thinking.",
  },
];

export const Route = createFileRoute("/guides/portfolio-examples")({
  head: () => ({
    meta: [
      { title: `${TITLE} — Giulio Pinotti` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: {
            "@type": "Person",
            name: "Giulio Pinotti",
            url: `${SITE}/about`,
            jobTitle: "Creative Director",
          },
          image: OG_IMAGE,
          mainEntityOfPage: URL,
          publisher: { "@type": "Person", name: "Giulio Pinotti", url: SITE },
        }),
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 flex justify-between items-center px-5 lg:px-premium-xl py-4 bg-background/80 backdrop-blur-xl">
        <Link
          to="/"
          className="text-[13px] font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          ← Back to work
        </Link>
        <Link
          to="/guides/creative-director-portfolio"
          className="text-[13px] font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          How to build your own →
        </Link>
      </div>

      <article className="max-w-[720px] mx-auto px-5 lg:px-0 pt-6 pb-24">
        <p className="text-[12px] uppercase tracking-[.12em] font-semibold text-foreground/70 mb-4">
          Guide
        </p>
        <h1 className="text-[34px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] mb-6">
          {TITLE}
        </h1>
        <p className="text-[18px] leading-[1.55] text-foreground/70 mb-12">
          Ten portfolios I return to when I'm hiring, pitching, or rebuilding my
          own. Each one solves a different problem — voice, sequencing, scope,
          craft — and each one earned a place because of a specific decision,
          not a generic aesthetic.
        </p>

        <section className="space-y-10 mb-16">
          {EXAMPLES.map((e, i) => (
            <div key={e.url} className="border-t border-foreground/10 pt-8">
              <p className="text-[12px] uppercase tracking-[.12em] font-semibold text-foreground/70 mb-2">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.02em] mb-3">
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  {e.name}
                </a>
              </h2>
              <p className="text-[17px] leading-[1.6] text-foreground/80">
                {e.why}
              </p>
            </div>
          ))}
        </section>

        <section className="border-t border-foreground/10 pt-8">
          <h2 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.02em] mb-4">
            What they have in common
          </h2>
          <ul className="space-y-3 text-[17px] leading-[1.6] text-foreground/80 list-disc pl-5">
            <li>Fewer projects, more conviction. Six great cases beat twenty average ones.</li>
            <li>The first sentence of every case is the idea, not the process.</li>
            <li>Business context sits above craft. Results are named, not implied.</li>
            <li>Sequencing is intentional — the strongest project is never buried.</li>
            <li>Voice is legible in five seconds, before any image loads.</li>
          </ul>
        </section>

        <div className="mt-16 border-t border-foreground/10 pt-8">
          <p className="text-[15px] text-foreground/70 mb-4">
            Want the framework behind these decisions?
          </p>
          <Link
            to="/guides/creative-director-portfolio"
            className="inline-flex items-center text-[15px] font-medium underline underline-offset-4"
          >
            Read: How to Build a Creative Director Portfolio →
          </Link>
        </div>
      </article>
    </div>
  );
}
