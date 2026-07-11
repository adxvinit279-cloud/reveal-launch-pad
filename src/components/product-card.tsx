import { Link } from "@tanstack/react-router";
import { ChevronUp, MessageSquare, ArrowUpRight } from "lucide-react";
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

export function ProductCard({ p, variant = "default" }: { p: ProductCardData; variant?: "default" | "compact" }) {
  const initials = p.name.slice(0, 2).toUpperCase();
  const img = p.logo_url;
  return (
    <article className="group relative flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft sm:p-5">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="shrink-0" aria-label={p.name}>
        {img ? (
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border sm:h-[68px] sm:w-[68px]"
          />
        ) : (
          <div
            className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-gradient font-display text-base font-black text-primary shadow-soft sm:h-[68px] sm:w-[68px]"
            aria-label={`${p.name} icon`}
            title={initials}
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to="/product/$slug"
              params={{ slug: p.slug }}
              className="block truncate font-display text-base font-semibold text-foreground group-hover:text-primary sm:text-lg"
            >
              {p.name}
            </Link>
            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{p.tagline}</p>
          </div>
          <Link
            to="/product/$slug"
            params={{ slug: p.slug }}
            className="group/upvote flex shrink-0 flex-col items-center justify-center rounded-xl border border-border bg-secondary/50 px-3 py-1.5 transition-colors hover:border-primary/40 hover:bg-brand-gradient"
            aria-label={`${p.upvote_count} upvotes`}
          >
            <ChevronUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold leading-none text-foreground">{p.upvote_count}</span>
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {p.category && (
            <Link
              to="/category/$slug"
              params={{ slug: p.category.slug }}
              className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-secondary/80"
            >
              {p.category.name}
            </Link>
          )}
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {pricingLabel(p.pricing)}
          </span>
          {p.is_featured && <Badge className="h-5 bg-primary px-2 text-[10px] text-primary-foreground">Featured</Badge>}
          {p.is_editors_pick && <Badge variant="secondary" className="h-5 px-2 text-[10px]">Editor's Pick</Badge>}
          {p.is_trending && <Badge className="h-5 bg-accent px-2 text-[10px] text-accent-foreground">Trending</Badge>}
        </div>

        {variant !== "compact" && (
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>{formatDate(p.launch_date)}</span>
              {typeof p.review_count === "number" && (
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> {p.review_count}
                </span>
              )}
            </div>
            <Link
              to="/product/$slug"
              params={{ slug: p.slug }}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              View <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}