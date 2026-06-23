import { createFileRoute, Link } from "@tanstack/react-router";
import socialShareAsset from "../assets/social-share.png.asset.json";

const SITE = "https://pinotti.work";
const URL = `${SITE}/guides/creative-director-portfolio`;
const OG_IMAGE = `${SITE}${socialShareAsset.url}`;

const TITLE = "How to Build a Creative Director Portfolio";
const DESCRIPTION =
  "A working Creative Director's guide to building a portfolio that gets hired — what to include, how to sequence projects, and portfolio examples that earn second meetings.";

export const Route = createFileRoute("/guides/creative-director-portfolio")({
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
          publisher: {
            "@type": "Person",
            name: "Giulio Pinotti",
            url: SITE,
          },
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
          to="/about"
          className="text-[13px] font-medium text-foreground/70 hover:text-foreground transition-colors"
        >
          About
        </Link>
      </div>

      <article className="max-w-[720px] mx-auto px-5 lg:px-0 pt-6 pb-24">
        <p className="text-[12px] uppercase tracking-[.12em] font-semibold text-foreground/50 mb-4">
          Guide
        </p>
        <h1 className="text-[34px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] mb-6">
          {TITLE}
        </h1>
        <p className="text-[18px] leading-[1.55] text-foreground/70 mb-12">
          A working Creative Director's playbook for portfolios that get hired —
          what hiring managers actually scan for, how to sequence projects, and
          the portfolio examples that earn second meetings.
        </p>

        <Prose>
          <h2>What a Creative Director portfolio is really for</h2>
          <p>
            A Creative Director portfolio is not a highlight reel. It is a
            decision tool. The people opening it — a Chief Marketing Officer, a
            Head of Talent, a founder — are trying to answer one question in
            roughly ninety seconds: <em>Can this person run the work I need
            run?</em> Everything in the portfolio should make that question
            easier to answer.
          </p>
          <p>
            Junior designers can lead with craft. A Creative Director's
            portfolio leads with <strong>judgment</strong>: the problems you
            chose to solve, the brands you trusted with your name, the bets you
            were willing to make, and the results those bets produced. Craft is
            still there — it has to be — but it sits underneath the story, not
            on top of it.
          </p>

          <h2>The five things every Creative Director portfolio needs</h2>
          <ol>
            <li>
              <strong>A one-line positioning statement.</strong> Above the
              fold, in plain language: who you are, what you do, and where you
              do it. "Creative Director — branding, content, advertising and
              design, based in São Paulo." If a recruiter has to scroll to
              figure out what you do, you have already lost them.
            </li>
            <li>
              <strong>Six to ten anchor projects.</strong> Not thirty. A
              Creative Director portfolio is graded on the weakest piece in it,
              not the strongest. Cut anything you would feel embarrassed
              defending in a room.
            </li>
            <li>
              <strong>A visible client roster.</strong> Logos still matter at
              this level. They are shorthand for "trusted with budget and
              brand." Put them somewhere a scanner will see.
            </li>
            <li>
              <strong>A short bio with a point of view.</strong> Two paragraphs.
              What you believe about the work, not just where you have worked.
            </li>
            <li>
              <strong>One way to contact you.</strong> Email, preferably. Not a
              form. Hiring managers do not fill out forms.
            </li>
          </ol>

          <h2>How to choose which projects to include</h2>
          <p>
            The instinct is to include everything you are proud of. Resist it.
            Use these four filters, in order:
          </p>
          <ul>
            <li>
              <strong>Recognisable brand or recognisable problem.</strong> A
              global brand the reader knows, or a problem they recognise from
              their own work.
            </li>
            <li>
              <strong>Clear creative decision you can defend.</strong> If you
              cannot say "we did X because Y" in one sentence, the project is
              not ready to show.
            </li>
            <li>
              <strong>Evidence it worked.</strong> Sales lift, share of voice,
              awards, press, a stat from the client. Anything that turns the
              piece from "we made this" into "we made this and it did this."
            </li>
            <li>
              <strong>Range.</strong> Across the six to ten pieces, show at
              least three formats — film, identity, campaign, product, content
              system. Specialists pigeonhole easily; range signals direction.
            </li>
          </ul>

          <h2>How to sequence the work</h2>
          <p>
            The order of projects on a portfolio matters more than most people
            think. The first three pieces decide whether the reader keeps
            going. Use this sequence:
          </p>
          <ul>
            <li>
              <strong>Open with your strongest, most recent piece.</strong>{" "}
              Strongest, not favourite. The one with the clearest brand,
              clearest decision, clearest result.
            </li>
            <li>
              <strong>Follow with range.</strong> If the opener was a campaign,
              piece two is identity or product. Prove you are not a one-format
              Creative Director.
            </li>
            <li>
              <strong>Place a strategic or unusual piece third.</strong>{" "}
              Something that shows how you think — a brand rebuild, a pro-bono
              project, a self-initiated thing. This is the slot that makes
              people email you.
            </li>
            <li>
              <strong>Let craft pieces fill the middle.</strong> Beautiful work
              for known brands. It holds attention without having to do heavy
              storytelling.
            </li>
            <li>
              <strong>Close with the longest-tenure relationship.</strong> A
              brand you have shaped over years. It signals depth and trust.
            </li>
          </ul>

          <h2>How each project page should be structured</h2>
          <p>
            Inside a project, fight the instinct to write a case study like a
            client deck. The reader does not need the brief — they need the
            shape of the decision. Aim for this structure on every project
            page:
          </p>
          <ol>
            <li>
              <strong>One sentence on the brand and the moment.</strong> "When
              Mastercard moved from a logo with a wordmark to a logo without
              one, we built the launch system that made it stick."
            </li>
            <li>
              <strong>One sentence on the creative bet.</strong> The decision
              you made, and what you chose not to do.
            </li>
            <li>
              <strong>The work, large and uncropped.</strong> Film embedded,
              not linked. Stills full-bleed. Identity systems shown in use, not
              on a grey background.
            </li>
            <li>
              <strong>A line of evidence.</strong> Numbers, awards, press, or a
              client quote. One line is enough.
            </li>
            <li>
              <strong>Credits at the bottom.</strong> Always. Generous credits
              are a Creative Director signal — they tell hiring managers you
              know how to run a team.
            </li>
          </ol>

          <h2>Portfolio examples to study</h2>
          <p>
            The best Creative Director portfolio examples to learn from are
            usually not the most decorated ones. Look at portfolios that strip
            away anything that is not a decision: a clear nav, a project list
            that loads fast, full-bleed work, and a one-paragraph bio. The
            common pattern across the strongest ones is restraint — fewer
            projects, more space around each one, and writing that reads like a
            person talking rather than an agency capabilities deck.
          </p>
          <p>
            If you want a working example to compare against, the rest of this
            site is a portfolio built on the principles in this guide —{" "}
            <Link to="/" className="underline underline-offset-2">
              selected works
            </Link>{" "}
            on the homepage,{" "}
            <Link to="/about" className="underline underline-offset-2">
              a short bio with a point of view
            </Link>{" "}
            on the about page, and project pages structured around the
            decision, not the brief.
          </p>

          <h2>What to leave out</h2>
          <ul>
            <li>
              <strong>Skills bars.</strong> A Creative Director rated 92% at
              "leadership" reads as junior.
            </li>
            <li>
              <strong>Generic process diagrams.</strong> Discover → Define →
              Design → Deliver tells a hiring manager nothing they do not
              already know.
            </li>
            <li>
              <strong>Every award you ever won.</strong> Three is convincing.
              Thirty is suspicious.
            </li>
            <li>
              <strong>Mood boards as case studies.</strong> Reference is not
              work.
            </li>
            <li>
              <strong>Hidden contact info.</strong> Email visible, no contact
              form gatekeeping it.
            </li>
          </ul>

          <h2>The maintenance habit</h2>
          <p>
            A Creative Director portfolio is never finished — it is rotated.
            Every six months, add the strongest new piece, drop the weakest
            existing piece, and re-sequence the first three. The portfolio
            stays roughly the same size and gets roughly thirty per cent
            stronger every year.
          </p>
          <p>
            That is the whole craft of it: fewer projects, sharper sequencing,
            a clearer point of view, and a relentless habit of replacing the
            weakest piece. Do that for two cycles and the portfolio starts
            doing the hiring conversation for you.
          </p>
        </Prose>

        <div className="mt-16 pt-8 border-t border-foreground/10 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-[14px] text-foreground/60">
            Written by Giulio Pinotti, Creative Director.
          </p>
          <div className="flex gap-3">
            <Link
              to="/"
              className="text-[13px] font-medium px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              See the portfolio
            </Link>
            <Link
              to="/about"
              className="text-[13px] font-medium px-4 py-2 rounded-full border border-foreground/15 hover:border-foreground/40 transition-colors"
            >
              About Giulio
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[17px] leading-[1.7] text-foreground/85
        [&>h2]:text-[24px] [&>h2]:md:text-[28px] [&>h2]:font-bold [&>h2]:tracking-[-0.02em]
        [&>h2]:mt-14 [&>h2]:mb-4 [&>h2]:text-foreground
        [&>p]:mb-5
        [&>ul]:mb-5 [&>ul]:pl-5 [&>ul]:list-disc [&>ul>li]:mb-2.5
        [&>ol]:mb-5 [&>ol]:pl-5 [&>ol]:list-decimal [&>ol>li]:mb-2.5
        [&_strong]:font-semibold [&_strong]:text-foreground"
    >
      {children}
    </div>
  );
}
