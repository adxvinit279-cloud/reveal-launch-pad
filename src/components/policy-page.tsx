import type { ReactNode } from "react";
import { PageHero } from "@/components/page-hero";

export function PolicyPage({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <article className="prose max-w-none text-foreground/90 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1">
          {children}
        </article>
      </div>
    </>
  );
}