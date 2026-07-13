import { SITE } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

const SECTIONS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Main",
    links: [
      { to: "/", label: "Home" },
      { to: "/products", label: "Products" },
      { to: "/categories", label: "Categories" },
      { to: "/blog", label: "Blog" },
      { to: "/submit-product", label: "Submit Product" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/advertise", label: "Advertise" },
      { to: "/write-for-us", label: "Write for Us" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/terms-and-conditions", label: "Terms & Conditions" },
      { to: "/disclaimer", label: "Disclaimer" },
      { to: "/editorial-policy", label: "Editorial Policy" },
    ],
  },
];

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — ProductReveal" },
      { name: "description", content: "HTML sitemap of every main page on ProductReveal — products, categories, blog, and trust pages." },
      { property: "og:title", content: "Sitemap — ProductReveal" },
      { property: "og:description", content: "Every main page on ProductReveal in one place." },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/sitemap` }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Navigate" title="Sitemap" description="Every main page on ProductReveal, in one place." />
      <div className="mx-auto grid max-w-4xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-lg font-semibold">{s.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {s.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-primary hover:underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="sm:col-span-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Looking for the machine-readable version? The XML sitemap with every product, category and blog post lives at{" "}
          <a href="/sitemap.xml" className="text-primary hover:underline">/sitemap.xml</a>.
        </div>
      </div>
    </>
  ),
});
