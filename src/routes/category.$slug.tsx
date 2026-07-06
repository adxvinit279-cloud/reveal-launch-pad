import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_SELECT, type ProductRow } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase.from("categories").select("id,slug,name,tagline,description").eq("slug", params.slug).maybeSingle();
    if (!data) throw notFound();
    return { category: data };
  },
  head: ({ loaderData, params }) => {
    const c = loaderData?.category;
    const title = c ? `${c.name} — Best ${c.name.toLowerCase()} on ProductReveal` : "Category";
    const desc = c?.description ?? "Browse this category on ProductReveal.";
    return {
      meta: [
        { title },
        { name: "description", content: desc.slice(0, 158) },
        { property: "og:title", content: title },
        { property: "og:description", content: desc.slice(0, 158) },
        { property: "og:url", content: `/category/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
  component: CategoryDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Category not found</h1>
      <Link to="/categories" className="mt-4 inline-block text-primary underline">See all categories</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
});

function CategoryDetail() {
  const { category } = Route.useLoaderData();
  const { data: products = [] } = useQuery({
    queryKey: ["cat-products", category.id],
    queryFn: async () =>
      ((await supabase.from("products").select(PRODUCT_SELECT).eq("status", "approved").eq("category_id", category.id).order("upvote_count", { ascending: false })).data ?? []) as unknown as ProductRow[],
  });
  const top = products.slice(0, 3);
  const recent = [...products].sort((a, b) => new Date(b.launch_date).getTime() - new Date(a.launch_date).getTime()).slice(0, 3);

  const faqs = [
    { q: `What are ${category.name.toLowerCase()}?`, a: category.description },
    { q: `How does ProductReveal choose ${category.name.toLowerCase()} to list?`, a: "Every submission goes through editorial review. We check the product website is live, that pricing information is honest, and that descriptions accurately reflect the product." },
    { q: `Can I submit my ${category.name.toLowerCase().replace(/s$/, "")}?`, a: "Absolutely. Head to the Submit Product page and share the details. Our editors publish approved listings within a few business days." },
  ];

  return (
    <>
      <PageHero eyebrow="Category" title={category.name} description={category.tagline}>
        <p className="max-w-3xl text-base text-foreground/80">{category.description}</p>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {top.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-display text-2xl font-bold">Top-rated {category.name.toLowerCase()}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {top.map((p) => <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />)}
            </div>
          </section>
        )}
        {recent.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-display text-2xl font-bold">Recently added</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {recent.map((p) => <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />)}
            </div>
          </section>
        )}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-2xl font-bold">All {category.name.toLowerCase()}</h2>
          {products.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
              No products in this category yet. <Link to="/submit" className="text-primary underline">Be the first to submit yours.</Link>
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((p) => <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />)}
            </div>
          )}
        </section>
        <section>
          <h2 className="mb-4 font-display text-2xl font-bold">Frequently asked questions</h2>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {faqs.map((f) => (
              <details key={f.q} className="p-5 [&_summary]:cursor-pointer">
                <summary className="font-display font-semibold">{f.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}