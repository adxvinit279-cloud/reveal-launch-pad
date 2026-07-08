import { Link } from "@tanstack/react-router";
import { ChevronUp, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { pricingLabel, formatDate } from "@/lib/site";

export type ProductCardData = {
  slug: string;
  name: string;
  tagline: string;
  pricing: string;
  upvote_count: number;
  launch_date: string;
  is_featured?: boolean;
  is_trending?: boolean;
  is_editors_pick?: boolean;
  review_count?: number;
  featured_image?: string | null;
  logo_url?: string | null;
  category?: { name: string; slug: string } | null;
};

export function ProductCard({ p }: { p: ProductCardData }) {
  const initials = p.name.slice(0, 2).toUpperCase();
  const img = p.logo_url; // small card icon uses logo only; featured image is reserved for the hero
  return (
    <article className="group relative flex gap-4 rounded-2xl border border-border/70 bg-card p-5 transition-all hover:shadow-soft hover:-translate-y-0.5">
      {img ? (
        <img src={img} alt={p.name} loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
      ) : (
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-gradient font-display text-lg font-black text-primary shadow-soft"
          aria-label={`${p.name} icon`}
          title={initials}
        >
          {/* Universal default ProductReveal icon */}
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="font-display text-lg font-semibold text-foreground hover:underline"
          >
            {p.name}
          </Link>
          {p.is_featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
          {p.is_editors_pick && <Badge variant="secondary">Editor's Pick</Badge>}
          {p.is_trending && <Badge className="bg-accent text-accent-foreground">Trending</Badge>}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {p.category && (
            <Link
              to="/category/$slug"
              params={{ slug: p.category.slug }}
              className="rounded-full bg-secondary px-2 py-0.5 font-medium text-foreground hover:bg-secondary/80"
            >
              {p.category.name}
            </Link>
          )}
          <span>{pricingLabel(p.pricing)}</span>
          <span aria-hidden>•</span>
          <span>Launched {formatDate(p.launch_date)}</span>
          {typeof p.review_count === "number" && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {p.review_count}
            </span>
          )}
        </div>
      </div>
      <div className="ml-2 flex flex-col items-center justify-center rounded-xl border border-border bg-secondary/60 px-3 py-2 text-center">
        <ChevronUp className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold text-foreground">{p.upvote_count}</span>
      </div>
    </article>
  );
}