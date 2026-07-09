import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, SITE } from "@/lib/site";

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
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
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
      <Link to="/blog" className="mt-4 inline-block text-primary underline">Back to blog</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const isHtml = /<\/?[a-z][^>]*>/i.test(post.content);
  const html = isHtml ? post.content : renderMarkdownString(post.content);

  const { data: related = [] } = useQuery({
    queryKey: ["blog-related", post.id],
    queryFn: async () =>
      (await supabase.from("blog_posts").select("slug,title,excerpt").eq("published", true).neq("id", post.id).limit(3)).data ?? [],
  });

  return (
    <>
      <section className="bg-hero-gradient border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{post.tags?.[0] ?? "Article"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-4 text-sm text-muted-foreground">
            By {post.author_name} · Published {formatDate(post.published_at)}
            {post.updated_at && post.updated_at !== post.published_at && <> · Updated {formatDate(post.updated_at)}</>}
          </div>
          {post.cover_image_url && (
            <img src={post.cover_image_url} alt="" className="mt-6 h-auto w-full rounded-2xl border border-border object-cover shadow-soft" />
          )}
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div>
          <div
            className="prose max-w-none text-foreground/90 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mt-5 [&_h4]:font-display [&_h4]:font-semibold [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline [&_img]:my-6 [&_img]:rounded-xl [&_table]:my-6 [&_table]:w-full [&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="mt-12 rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold">About the author</h3>
            <p className="mt-2 text-sm text-muted-foreground">{post.author_bio ?? "The ProductReveal editorial team writes original guides and reviews for makers."}</p>
          </div>
          {related.length > 0 && (
            <div className="mt-10">
              <h3 className="font-display text-xl font-semibold">Related articles</h3>
              <div className="mt-4 grid gap-3">
                {related.map((r) => (
                  <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="rounded-xl border border-border bg-card p-4 hover:shadow-soft">
                    <div className="font-display font-semibold">{r.title}</div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
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