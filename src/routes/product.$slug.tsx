import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronUp, ExternalLink, Bookmark, Share2, Flag, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { fetchProductBySlug, PRODUCT_SELECT, type ProductRow } from "@/lib/products";
import { pricingLabel, formatDate, SITE } from "@/lib/site";
import { ProductCard } from "@/components/product-card";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.product;
    const title = p?.seo_title || (p ? `${p.name} — ${p.tagline}` : "Product — ProductReveal");
    const desc = p?.seo_description || p?.tagline || SITE.description;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/product/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.name,
                description: p.description,
                brand: p.founder_name ?? SITE.name,
                url: p.website_url,
              }),
            },
          ]
        : [],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <p className="mt-2 text-muted-foreground">The product you're looking for isn't on ProductReveal.</p>
      <Link to="/products" className="mt-6 inline-block text-primary underline">Browse products</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const initials = product.name.slice(0, 2).toUpperCase();
  const qc = useQueryClient();
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user?.id ?? null));
  }, []);

  const { data: similar = [] } = useQuery({
    queryKey: ["similar", product.id],
    queryFn: async () => {
      if (!product.category_id) return [];
      const { data } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("status", "approved")
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .order("upvote_count", { ascending: false })
        .limit(3);
      return (data ?? []) as unknown as ProductRow[];
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", product.id],
    queryFn: async () =>
      (
        await supabase
          .from("reviews")
          .select("id,author_name,rating,comment,created_at")
          .eq("product_id", product.id)
          .eq("status", "approved")
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  async function upvote() {
    if (!user) { toast.info("Sign in to upvote"); return; }
    const { error } = await supabase.from("product_upvotes").insert({ product_id: product.id, user_id: user });
    if (error && !error.message.includes("duplicate")) return toast.error(error.message);
    toast.success("Upvoted!");
    qc.invalidateQueries();
  }

  return (
    <>
      <section className="bg-hero-gradient border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-brand-gradient font-display text-2xl font-black text-primary shadow-soft">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {product.is_featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
                {product.is_editors_pick && <Badge variant="secondary">Editor's Pick</Badge>}
                {product.is_trending && <Badge className="bg-accent text-accent-foreground">Trending</Badge>}
                <Badge variant="outline">{pricingLabel(product.pricing)}</Badge>
                {product.categories && (
                  <Link to="/category/$slug" params={{ slug: product.categories.slug }} className="text-xs font-medium text-primary hover:underline">
                    {product.categories.name}
                  </Link>
                )}
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">{product.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <a href={product.website_url} target="_blank" rel="noopener noreferrer nofollow">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Visit website <ExternalLink className="ml-1.5 h-4 w-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={upvote}>
                  <ChevronUp className="mr-1 h-4 w-4" /> Upvote · {product.upvote_count}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast.info("Saved to your bookmarks")}><Bookmark className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <Prose title="About this product">
            <p className="whitespace-pre-line">{product.description}</p>
          </Prose>
          {product.key_features.length > 0 && (
            <Prose title="Key features">
              <ul className="list-disc space-y-1.5 pl-5">
                {product.key_features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </Prose>
          )}
          {product.best_for && (
            <Prose title="Best for">
              <p>{product.best_for}</p>
            </Prose>
          )}
          {(product.pros.length > 0 || product.cons.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display font-semibold text-primary">Pros</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {product.pros.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display font-semibold text-destructive">Cons</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {product.cons.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl font-bold">Reviews</h2>
            <p className="mt-1 text-sm text-muted-foreground">Reviews are moderated before appearing publicly.</p>
            <div className="mt-6 space-y-4">
              {reviews.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                  No reviews yet — be the first to share your experience.
                </p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{r.author_name}</div>
                      <div className="text-sm text-primary">{"★".repeat(r.rating)}<span className="text-muted-foreground">{"★".repeat(5 - r.rating)}</span></div>
                    </div>
                    <p className="mt-2 text-sm text-foreground/90">{r.comment}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
                  </div>
                ))
              )}
            </div>
            <ReviewForm productId={product.id} />
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-5 text-sm text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> ProductReveal may use affiliate or referral links where applicable. Product details are provided by the maker and reviewed by our editorial team; verify pricing and features on the official website before purchase.
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold">Product info</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row k="Pricing" v={pricingLabel(product.pricing)} />
              <Row k="Category" v={product.categories?.name ?? "—"} />
              <Row k="Launch date" v={formatDate(product.launch_date)} />
              <Row k="Founder" v={product.founder_name ?? "—"} />
            </dl>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold">Are you the maker?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Claim this product or request corrections and we'll update the listing.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/contact" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                <Building2 className="h-4 w-4" /> Claim this product
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                <Flag className="h-4 w-4" /> Report incorrect information
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-bold">Similar products</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <ProductCard key={p.id} p={{ ...p, category: p.categories ?? null }} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Prose({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <div className="prose mt-3 max-w-none text-foreground/90">{children}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function ReviewForm({ productId }: { productId: string }) {
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return toast.info("Sign in to leave a review");
    if (comment.trim().length < 10) return toast.error("Please write at least 10 characters");
    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: userData.user.id,
      author_name: name.trim() || (userData.user.email?.split("@")[0] ?? "Guest"),
      rating,
      comment: comment.trim(),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Thanks — your review is pending moderation.");
    setComment(""); setName("");
    qc.invalidateQueries();
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-border bg-card p-5">
      <h3 className="font-display font-semibold">Write a review</h3>
      <div className="mt-3 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} onClick={() => setRating(n)} className="text-2xl leading-none">
            <span className={n <= rating ? "text-primary" : "text-muted-foreground/40"}>★</span>
          </button>
        ))}
      </div>
      <Input className="mt-3" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
      <Textarea className="mt-3" rows={4} placeholder="Share your honest experience…" value={comment} onChange={(e) => setComment(e.target.value)} required />
      <Button type="submit" disabled={loading} className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90">
        {loading ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}