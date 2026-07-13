import { SITE } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/page-hero";
import { BlogCard, type BlogListItem } from "@/components/blog-card";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Blog — Guides, roundups & buyer advice — ProductReveal" },
      { name: "description", content: "Original articles, buying guides, product roundups and comparisons for founders, makers and small teams — from the ProductReveal editorial team." },
      { property: "og:title", content: "ProductReveal Blog" },
      { property: "og:description", content: "Guides, roundups and buyer advice for makers." },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/blog` }],
  }),
});

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