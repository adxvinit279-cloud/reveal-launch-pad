import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient font-black text-primary shadow-soft">P</span>
          {SITE.name}
        </Link>
        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "!text-foreground bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/products"
            aria-label="Search products"
            className="hidden rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link to="/submit-product" className="hidden md:block">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Product</Button>
          </Link>
          <button
            className="rounded-md p-2 text-foreground md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/submit-product" onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full bg-primary text-primary-foreground">Submit Product</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}