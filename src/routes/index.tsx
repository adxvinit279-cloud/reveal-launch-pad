import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, ShieldCheck, Search, Rocket, Award, Link2, FileText, Gauge, UserCheck, ChevronUp, Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { BlogCard, type BlogListItem } from "@/components/blog-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { fetchApprovedProducts } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "What is ProductReveal?",
    a: "ProductReveal is a product discovery platform where makers submit new AI tools, SaaS apps, templates, plugins and digital products, and readers browse editor-reviewed listings to find trusted new products.",
  },
  {
    q: "Is it free to submit a product?",
    a: "Yes. Submitting a product to ProductReveal is completely free — no account or credit card required. Every submission is reviewed by an editor before it goes live.",
  },
  {
    q: "How long does the review process take?",
    a: "Most submissions are reviewed within a few business days. We check that the product is real, working, and described accurately before publishing the listing.",
  },
  {
    q: "Do listings include a link to my website?",
    a: "Yes. Every approved listing includes a link to your product's official website, along with your logo, screenshots, pricing details and key features.",
  },
  {
    q: "Are the product pages SEO-friendly?",
    a: "Each product page uses clean markup, descriptive meta tags and structured data — built for discoverability, helping search engines understand your product. We don't guarantee rankings, but pages are designed to be easy to crawl and index.",
  },
  {
    q: "Can I write for the ProductReveal blog?",
    a: "Yes — we accept guest articles about product building, tools and the maker economy. Visit our Write for Us page for guidelines and how to pitch.",
  },
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: `${SITE.name} — Discover new digital products, tools & startups` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: `${SITE.name} — Discover new digital products, tools & startups` },
      { property: "og:description", content: SITE.description },
      { property: "og:url", content: `${SITE.url}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

function Index() {
  const { data: featured = [] } = useQuery({
    queryKey: ["home", "featured"],
    queryFn: () => fetchApprovedProducts({ featured: true, sort: "newest", limit: 6 }),
  });
  const { data: trending = [] } = useQuery({
    queryKey: ["home", "trending"],
    queryFn: () => fetchApprovedProducts({ sort: "trending", limit: 5 }),
  });
  const { data: newest = [] } = useQuery({
    queryKey: ["home", "newest"],
    queryFn: () => fetchApprovedProducts({ sort: "newest", limit: 10 }),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["home", "categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("slug,name,tagline,featured_image").order("sort_order");
      return data ?? [];
    },
  });
  const { data: latestPosts = [] } = useQuery({
    queryKey: ["home", "latest-blogs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,cover_image_url,author_name,published_at,tags")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(6);
      return (data ?? []) as BlogListItem[];
    },
  });

  return (
    <>
      <section className="bg-hero-gradient border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Fresh launches every day
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              Reveal Your Product to the Right Audience
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Submit your startup, SaaS, AI tool, template, plugin, or digital product on
              ProductReveal and get discovered by readers looking for trusted new products.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/submit-product">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit Your Product <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-primary/30">
                  Explore Products
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Rocket, title: "Free Product Submission", body: "List your product for free — no account or credit card required." },
                { icon: Award, title: "High-Quality Listings", body: "Every listing is written and formatted for a clean, trustworthy look." },
                { icon: Link2, title: "Trusted Backlink Opportunity", body: "Approved listings include a link to your product website." },
                { icon: FileText, title: "SEO-Friendly Product Pages", body: "Clean markup, meta tags and structured data on every page." },
                { icon: Gauge, title: "Built for Discoverability", body: "Fast pages and clear structure help search engines understand your product." },
                { icon: UserCheck, title: "Admin-Reviewed Listings", body: "A real editor reviews every submission before it goes live." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-border/70 bg-background/70 p-4 backdrop-blur">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-2 font-display text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrowIcon={Award}
        eyebrow="Featured"
        title="Featured products"
        subtitle="Handpicked by the ProductReveal editorial team."
        link={{ to: "/products", label: "See all" }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((p) => (
            <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />
          ))}
        </div>
      </Section>

      <Section
        eyebrowIcon={Flame}
        eyebrow="Trending"
        title="Trending now"
        subtitle="Top 5 products ranked by community upvotes."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {trending.slice(0, 5).map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-gradient font-display text-sm font-bold text-primary">
                {i + 1}
              </span>
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} loading="lazy" className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-border" />
              ) : (
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-gradient text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="block truncate font-display text-base font-semibold hover:text-primary">
                  {p.name}
                </Link>
                <p className="line-clamp-1 text-sm text-muted-foreground">{p.tagline}</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border bg-secondary/60 px-2.5 py-1.5">
                <ChevronUp className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold leading-none text-foreground">{p.upvote_count}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrowIcon={Rocket}
        eyebrow="Latest"
        title="Latest launches"
        subtitle="The 10 newest products approved on ProductReveal."
        link={{ to: "/products", label: "Browse all" }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {newest.slice(0, 10).map((p) => (
            <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />
          ))}
        </div>
      </Section>

      <Section
        eyebrowIcon={Sparkles}
        eyebrow="Categories"
        title="Trending categories"
        subtitle="Browse curated collections across the maker economy."
        link={{ to: "/categories", label: "All categories" }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((c: { slug: string; name: string; tagline: string | null; featured_image?: string | null }) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
            >
              {c.featured_image ? (
                <img src={c.featured_image} alt="" loading="lazy" className="mb-4 h-12 w-12 rounded-xl object-cover ring-1 ring-border" />
              ) : (
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
              )}
              <h3 className="font-display text-lg font-semibold group-hover:text-primary">{c.name}</h3>
              {c.tagline && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.tagline}</p>}
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {latestPosts.length > 0 && (
        <Section
          eyebrowIcon={FileText}
          eyebrow="Blog"
          title="From the blog"
          subtitle="Guides, roundups and buying advice from the ProductReveal editorial team."
          link={{ to: "/blog", label: "All articles" }}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.slice(0, 6).map((post) => (
              <BlogCard key={post.slug} p={post} />
            ))}
          </div>
        </Section>
      )}

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

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between md:p-12">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Have a product to share?</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Submit your product for free and get discovered by ProductReveal readers. No account required.
            </p>
          </div>
          <Link to="/submit-product">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Product</Button>
          </Link>
        </div>
      </section>

      <Section
        eyebrowIcon={Search}
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Everything makers and readers ask us most."
      >
        <div className="mx-auto grid max-w-3xl gap-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-colors open:border-primary/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>



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
  eyebrow,
  eyebrowIcon: EyebrowIcon,
}: {
  title: string;
  subtitle?: string;
  link?: { to: string; label: string };
  children: React.ReactNode;
  eyebrow?: string;
  eyebrowIcon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              {EyebrowIcon && <EyebrowIcon className="h-3 w-3" />}
              {eyebrow}
            </span>
          )}
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
