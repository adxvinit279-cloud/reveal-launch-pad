import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-hero-gradient border-b border-border/60">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        )}
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}