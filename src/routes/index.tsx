import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, ShieldCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { fetchApprovedProducts } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: `${SITE.name} — Discover new digital products, tools & startups` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: `${SITE.name} — Discover new digital products, tools & startups` },
      { property: "og:description", content: SITE.description },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const { data: featured = [] } = useQuery({
    queryKey: ["home", "featured"],
    queryFn: () => fetchApprovedProducts({ sort: "trending", limit: 6 }),
  });
  const { data: newest = [] } = useQuery({
    queryKey: ["home", "newest"],
    queryFn: () => fetchApprovedProducts({ sort: "newest", limit: 6 }),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["home", "categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("slug,name,tagline").order("sort_order");
      return data ?? [];
    },
  });
  const editorsPicks = featured.filter((p) => p.is_editors_pick).slice(0, 3);
  const topToday = [...featured].sort((a, b) => b.upvote_count - a.upvote_count).slice(0, 5);

  return (
    <>
      <section className="bg-hero-gradient border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Fresh launches every day
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              Discover new products, tools & startups
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              ProductReveal helps you find the best AI tools, SaaS apps, templates, plugins,
              and digital products launched by makers around the world.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore Products <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/submit-product">
                <Button size="lg" variant="outline" className="border-primary/30">
                  Submit Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section title="Featured products" subtitle="Handpicked by the ProductReveal editorial team." link={{ to: "/products", label: "See all" }}>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.slice(0, 4).map((p) => (
            <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />
          ))}
        </div>
      </Section>

      <Section title="Today's top products" subtitle="Ranked by community upvotes right now.">
        <div className="grid gap-3">
          {topToday.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-bold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="font-display text-base font-semibold hover:underline">
                  {p.name}
                </Link>
                <p className="line-clamp-1 text-sm text-muted-foreground">{p.tagline}</p>
              </div>
              <span className="rounded-lg bg-brand-gradient px-3 py-1.5 text-sm font-bold text-primary">▲ {p.upvote_count}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Trending categories" subtitle="Browse curated collections across the maker economy." link={{ to: "/categories", label: "All categories" }}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group rounded-2xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="mb-3 h-10 w-10 rounded-xl bg-brand-gradient" />
              <h3 className="font-display text-lg font-semibold">{c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Editor's picks" subtitle="Products our editors think you shouldn't miss.">
        <div className="grid gap-4 md:grid-cols-3">
          {editorsPicks.map((p) => (
            <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />
          ))}
        </div>
      </Section>

      <Section title="Latest launches" subtitle="The newest products approved on ProductReveal." link={{ to: "/products", label: "Browse all" }}>
        <div className="grid gap-4 md:grid-cols-2">
          {newest.slice(0, 4).map((p) => (
            <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />
          ))}
        </div>
      </Section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 rounded-3xl border border-border/70 bg-brand-gradient p-8 md:grid-cols-3 md:p-12">
          <div className="md:col-span-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary">
              Get one weekly email of the best new launches
            </h2>
            <p className="mt-2 max-w-xl text-primary/80">
              Zero spam. Unsubscribe any time. Join thousands of founders and product-people already reading.
            </p>
          </div>
          <div className="md:col-span-1">
            <NewsletterForm />
          </div>
        </div>
      </section>

      <Section title="How ProductReveal reviews products" subtitle="Trust is earned. Here's how we keep the site useful.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Human editorial review", body: "Every submission is reviewed by a real editor before it appears on the site — no auto-publishing." },
            { icon: Search, title: "Original descriptions", body: "We write our own product summaries and best-for notes so listings actually help you decide." },
            { icon: Sparkles, title: "Moderated community", body: "Upvotes and reviews are moderated to prevent fake accounts and low-quality noise." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border/70 bg-card p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="pb-16" />
    </>
  );
}

function Section({
  title,
  subtitle,
  link,
  children,
}: {
  title: string;
  subtitle?: string;
  link?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
        {link && (
          <Link to={link.to} className="shrink-0 text-sm font-medium text-primary hover:underline">
            {link.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
