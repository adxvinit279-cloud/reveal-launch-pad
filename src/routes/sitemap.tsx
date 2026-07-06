import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { FOOTER_LINKS, NAV_LINKS } from "@/lib/site";
export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — ProductReveal" },
      { name: "description", content: "HTML sitemap of every main page on ProductReveal — products, categories, blog, and trust pages." },
      { property: "og:title", content: "Sitemap — ProductReveal" },
      { property: "og:description", content: "Every main page on ProductReveal in one place." },
    ],
    links: [{ rel: "canonical", href: "/sitemap" }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Navigate" title="Sitemap" description="Every main page on ProductReveal, in one place." />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-semibold">Main</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="text-primary hover:underline">Home</Link></li>
            {NAV_LINKS.map((l) => <li key={l.to}><Link to={l.to} className="text-primary hover:underline">{l.label}</Link></li>)}
          </ul>
        </div>
        {(Object.entries(FOOTER_LINKS) as [string, readonly {to:string;label:string}[]][]).map(([g, items]) => (
          <div key={g}>
            <h2 className="font-display text-lg font-semibold">{g}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {items.map((l) => <li key={l.to}><Link to={l.to} className="text-primary hover:underline">{l.label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
    </>
  ),
});