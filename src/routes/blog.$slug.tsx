import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, SITE } from "@/lib/site";
import { BlogCard } from "@/components/blog-card";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_SELECT, type ProductRow } from "@/lib/products";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase.from("blog_posts").select("*").eq("slug", params.slug).eq("published", true).maybeSingle();
    if (!data) throw notFound();
    return { post: data };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.post;
    const title = p?.seo_title || (p?.title ?? "Article");
    const desc = p?.seo_description || p?.excerpt || SITE.description;
    const img = p?.cover_image_url;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        ...(img ? [{ property: "og:image" as const, content: img }, { name: "twitter:card", content: "summary_large_image" }] : []),
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: p.title,
                image: img ?? undefined,
                datePublished: p.published_at,
                dateModified: p.updated_at,
                author: { "@type": "Person", name: p.author_name },
              }),
            },
          ]
        : [],
    };
  },
  component: BlogPost,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Post not found</h1>
      <p className="mt-2 text-muted-foreground">The article you're looking for isn't on ProductReveal.</p>
      <Link to="/blog" className="mt-6 inline-block text-primary underline">Back to blog</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const isHtml = /<\/?[a-z][^>]*>/i.test(post.content);
  const rawHtml = isHtml ? post.content : renderMarkdownString(post.content);
  const { html, toc } = useMemo(() => injectHeadingIds(rawHtml), [rawHtml]);
  const category = post.tags?.[0] ?? "Article";

  const { data: related = [] } = useQuery({
    queryKey: ["blog-related", post.id],
      queryFn: async () =>
      ((await supabase.from("blog_posts").select("slug,title,excerpt,cover_image_url,author_name,published_at,tags").eq("published", true).neq("id", post.id).order("published_at", { ascending: false }).limit(4)).data ?? []) as Array<{
        slug: string; title: string; excerpt: string | null; cover_image_url: string | null; author_name: string; published_at: string; tags: string[] | null;
      }>,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["blog-related-products", post.id],
    queryFn: async () =>
      ((await supabase.from("products").select(PRODUCT_SELECT).eq("status", "approved").order("upvote_count", { ascending: false }).limit(3)).data ?? []) as unknown as ProductRow[],
  });

  return (
    <>
      <section className="border-b border-border/60 bg-hero-gradient">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/blog" className="font-semibold text-primary hover:underline">Blog</Link>
            <span className="text-muted-foreground">/</span>
            <span className="rounded-full bg-background/80 px-2.5 py-1 font-semibold text-primary shadow-soft">{category}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
          <div className="mt-5 text-sm text-muted-foreground">
            By <span className="font-medium text-foreground">{post.author_name}</span> · Published {formatDate(post.published_at)}
            {post.updated_at && post.updated_at !== post.published_at && <> · Updated {formatDate(post.updated_at)}</>}
          </div>
        </div>
      </section>

      {post.cover_image_url && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="-mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="aspect-[16/9] w-full">
              <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_260px]">
        <article className="min-w-0">
          <div
            className="prose max-w-none text-foreground/90 [&_h2]:mt-8 [&_h2]:scroll-mt-24 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:scroll-mt-24 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mt-5 [&_h4]:font-display [&_h4]:font-semibold [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-secondary/50 [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline [&_img]:my-6 [&_img]:rounded-xl [&_table]:my-6 [&_table]:w-full [&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="mt-12 rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold">About the author</h3>
            <p className="mt-2 text-sm text-muted-foreground">{post.author_bio ?? "The ProductReveal editorial team writes original guides and reviews for makers."}</p>
          </div>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          {toc.length > 0 && (
            <nav className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">On this page</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {toc.map((h) => (
                  <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                    <a href={`#${h.id}`} className="text-foreground/80 hover:text-primary">{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold">Discover more</h3>
            <p className="mt-1 text-sm text-muted-foreground">Explore trending tools, SaaS launches and AI products on ProductReveal.</p>
            <Link to="/products" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">Browse products →</Link>
          </div>
        </aside>
      </div>

      {relatedProducts.length > 0 && (
        <section className="border-t border-border/60 bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="mb-6 font-display text-2xl font-bold">Related products</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-bold">Related articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => <BlogCard key={r.slug} p={r} />)}
          </div>
        </section>
      )}
    </>
  );
}

function renderMarkdownString(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return md.split(/\n\n+/).map((b) => {
    const h2 = b.match(/^##\s+(.+)/);
    if (h2) return `<h2>${esc(h2[1])}</h2>`;
    return `<p>${esc(b).replace(/\n/g, "<br />")}</p>`;
  }).join("\n");
}

function slugifyHeading(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function injectHeadingIds(html: string): { html: string; toc: Array<{ id: string; text: string; level: 2 | 3 }> } {
  const toc: Array<{ id: string; text: string; level: 2 | 3 }> = [];
  const seen = new Set<string>();
  const out = html.replace(/<(h2|h3)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (_m, tag, attrs = "", inner) => {
    const text = String(inner).replace(/<[^>]+>/g, "").trim();
    if (!text) return `<${tag}${attrs}>${inner}</${tag}>`;
    let id = slugifyHeading(text);
    let n = 2;
    while (seen.has(id)) id = `${slugifyHeading(text)}-${n++}`;
    seen.add(id);
    toc.push({ id, text, level: tag.toLowerCase() === "h2" ? 2 : 3 });
    const cleanAttrs = String(attrs).replace(/\sid=("[^"]*"|'[^']*')/i, "");
    return `<${tag}${cleanAttrs} id="${id}">${inner}</${tag}>`;
  });
  return { html: out, toc };
}