import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_SELECT, type ProductRow } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { PageHero } from "@/components/page-hero";
import { Input } from "@/components/ui/input";

const SORTS = [
  { id: "trending", label: "Trending" },
  { id: "newest", label: "Newest" },
  { id: "upvoted", label: "Most Upvoted" },
] as const;

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "All Products — ProductReveal" },
      { name: "description", content: "Browse every AI tool, SaaS app, template, plugin and startup listed on ProductReveal. Filter by category and sort by trending, newest or most upvoted." },
      { property: "og:title", content: "All Products — ProductReveal" },
      { property: "og:description", content: "Browse every AI tool, SaaS app, template, plugin and startup listed on ProductReveal." },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
});

function ProductsPage() {
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("trending");
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories-nav"],
    queryFn: async () => (await supabase.from("categories").select("slug,name").order("sort_order")).data ?? [],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", sort, categorySlug],
    queryFn: async () => {
      let query = supabase.from("products").select(PRODUCT_SELECT).eq("status", "approved");
      if (categorySlug) {
        const { data: cat } = await supabase.from("categories").select("id").eq("slug", categorySlug).maybeSingle();
        if (cat) query = query.eq("category_id", cat.id);
      }
      if (sort === "newest") query = query.order("launch_date", { ascending: false });
      else if (sort === "upvoted") query = query.order("upvote_count", { ascending: false });
      else query = query.order("is_trending", { ascending: false }).order("upvote_count", { ascending: false });
      const { data } = await query;
      return (data ?? []) as unknown as ProductRow[];
    },
  });

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return products;
    return products.filter((p) => p.name.toLowerCase().includes(t) || p.tagline.toLowerCase().includes(t));
  }, [products, q]);

  return (
    <>
      <PageHero
        eyebrow="Discover"
        title="All products"
        description="Every product listed on ProductReveal — filter by category or sort to find your next favourite tool."
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products by name or tagline…"
          className="max-w-md bg-background"
        />
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <Chip active={!categorySlug} onClick={() => setCategorySlug(null)}>All</Chip>
          {categories.map((c) => (
            <Chip key={c.slug} active={categorySlug === c.slug} onClick={() => setCategorySlug(c.slug)}>
              {c.name}
            </Chip>
          ))}
        </div>
        <div className="mb-6 flex gap-2">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                sort === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No products match your filters. <Link to="/submit-product" className="text-primary underline">Submit yours</Link>.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}