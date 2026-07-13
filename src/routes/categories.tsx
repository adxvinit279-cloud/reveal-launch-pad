import { SITE } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
  head: () => ({
    meta: [
      { title: "Categories — Browse products by type — ProductReveal" },
      { name: "description", content: "Browse ProductReveal by category: AI tools, SaaS, WordPress, Shopify, templates, no-code, marketing, productivity, design and developer tools." },
      { property: "og:title", content: "Categories — ProductReveal" },
      { property: "og:description", content: "Browse ProductReveal categories: AI tools, SaaS, templates, no-code and more." },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/categories` }],
  }),
});

function CategoriesPage() {
  const { data: cats = [] } = useQuery({
    queryKey: ["categories-all"],
    queryFn: async () => (await supabase.from("categories").select("slug,name,tagline,description").order("sort_order")).data ?? [],
  });
  return (
    <>
      <PageHero
        eyebrow="Browse"
        title="Every category on ProductReveal"
        description="Curated collections across AI, SaaS, WordPress, Shopify, templates, no-code, marketing, productivity, design and developer tools."
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group rounded-2xl border border-border/70 bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="mb-3 h-10 w-10 rounded-xl bg-brand-gradient" />
              <h2 className="font-display text-xl font-semibold">{c.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
              <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{c.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary">Browse {c.name} →</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}