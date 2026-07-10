import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/page-hero";
import { formatDate } from "@/lib/site";

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Blog — Guides, roundups & buyer advice — ProductReveal" },
      { name: "description", content: "Original articles, buying guides, product roundups and comparisons for founders, makers and small teams — from the ProductReveal editorial team." },
      { property: "og:title", content: "ProductReveal Blog" },
      { property: "og:description", content: "Guides, roundups and buyer advice for makers." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string;
  published_at: string;
  tags: string[] | null;
};

function BlogIndex() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-index"],
    queryFn: async () =>
      ((await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,cover_image_url,author_name,published_at,tags")
        .eq("published", true)
        .order("published_at", { ascending: false })).data ?? []) as BlogListItem[],
  });

  return (
    <>
      <PageHero eyebrow="Blog" title="Guides, roundups and buyer advice" description="Original writing from the ProductReveal editorial team — for founders, makers and small teams." />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border/70 bg-card">
                <div className="aspect-[16/9] w-full bg-secondary" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-24 rounded bg-secondary" />
                  <div className="h-5 w-3/4 rounded bg-secondary" />
                  <div className="h-3 w-full rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">No blog posts published yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <BlogCard key={p.slug} p={p} />)}
          </div>
        )}
      </div>
    </>
  );
}

export function BlogCard({ p }: { p: BlogListItem }) {
  const category = p.tags?.[0] ?? "Article";
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: p.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
        {p.cover_image_url ? (
          <img src={p.cover_image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-brand-gradient">
            <svg viewBox="0 0 24 24" className="h-12 w-12 text-primary/80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-primary shadow-soft backdrop-blur">
          {category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary">{p.title}</h2>
        {p.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>}
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="truncate">{p.author_name} · {formatDate(p.published_at)}</span>
          <span className="whitespace-nowrap font-semibold text-primary group-hover:underline">Read more →</span>
        </div>
      </div>
    </Link>
  );
}