import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/site";

export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string;
  published_at: string;
  tags: string[] | null;
};

export function BlogCard({ p, variant = "default" }: { p: BlogListItem; variant?: "default" | "compact" }) {
  const category = p.tags?.[0] ?? "Article";
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: p.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
        {p.cover_image_url ? (
          <img
            src={p.cover_image_url}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-brand-gradient">
            <svg viewBox="0 0 24 24" className="h-12 w-12 text-primary/80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary shadow-soft backdrop-blur">
          {category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-display font-semibold leading-snug text-foreground group-hover:text-primary ${variant === "compact" ? "text-base" : "text-lg"}`}>
          {p.title}
        </h3>
        {p.excerpt && variant !== "compact" && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 truncate">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(p.published_at)}
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-primary group-hover:underline">
            Read <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}