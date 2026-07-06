import { Link } from "@tanstack/react-router";
import { FOOTER_LINKS, SITE } from "@/lib/site";
import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient font-black text-primary">P</span>
            {SITE.name}
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {SITE.description}
          </p>
          <div className="mt-6">
            <NewsletterForm compact />
          </div>
        </div>
        {(Object.entries(FOOTER_LINKS) as [string, readonly { to: string; label: string }[]][]).map(([group, links]) => (
          <div key={group}>
            <h4 className="text-sm font-semibold text-foreground">{group}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Product listings may include affiliate or referral links.</p>
        </div>
      </div>
    </footer>
  );
}