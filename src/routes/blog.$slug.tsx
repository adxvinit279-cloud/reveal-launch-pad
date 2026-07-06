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
  const headings = [...post.content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1]);

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
        </div>
      </section>

      <article className="mx-auto grid max-w-4xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">On this page</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {headings.map((h) => (
                <li key={h}><a href={`#${slugify(h)}`} className="text-muted-foreground hover:text-foreground">{h}</a></li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="lg:col-span-3">
          <div className="prose max-w-none text-foreground/90 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_p]:mt-4 [&_p]:leading-relaxed">
            {renderMarkdown(post.content)}
          </div>
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

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function renderMarkdown(md: string) {
  const blocks = md.split(/\n\n+/);
  return blocks.map((b, i) => {
    const h2 = b.match(/^##\s+(.+)/);
    if (h2) return <h2 key={i} id={slugify(h2[1])}>{h2[1]}</h2>;
    return <p key={i}>{b}</p>;
  });
}