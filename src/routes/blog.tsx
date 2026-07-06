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

function BlogIndex() {
  const { data: posts = [] } = useQuery({
    queryKey: ["blog-index"],
    queryFn: async () =>
      (await supabase.from("blog_posts").select("slug,title,excerpt,cover_image_url,author_name,published_at,tags").eq("published", true).order("published_at", { ascending: false })).data ?? [],
  });

  return (
    <>
      <PageHero eyebrow="Blog" title="Guides, roundups and buyer advice" description="Original writing from the ProductReveal editorial team — for founders, makers and small teams." />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group rounded-2xl border border-border/70 bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="mb-4 h-40 rounded-xl bg-brand-gradient" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(p.published_at)}</span>
                <span>·</span>
                <span>{p.author_name}</span>
              </div>
              <h2 className="mt-2 font-display text-xl font-semibold group-hover:underline">{p.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}