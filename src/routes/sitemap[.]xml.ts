import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://productreveal.online";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const supabase = createClient(
          process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
          { auth: { persistSession: false } },
        );
        const staticPaths = [
          "/", "/products", "/categories", "/blog", "/submit-product", "/about", "/contact",
          "/privacy-policy", "/terms-and-conditions", "/disclaimer",
          "/editorial-policy", "/advertise", "/write-for-us", "/sitemap",
        ];
        const [{ data: products }, { data: cats }, { data: posts }] = await Promise.all([
          supabase.from("products").select("slug,updated_at").eq("status", "approved"),
          supabase.from("categories").select("slug"),
          supabase.from("blog_posts").select("slug,updated_at").eq("published", true),
        ]);
        const entries = new Map<string, string | null>();
        for (const p of staticPaths) entries.set(p, null);
        for (const p of products ?? []) entries.set(`/product/${p.slug}`, p.updated_at ?? null);
        for (const c of cats ?? []) entries.set(`/category/${c.slug}`, null);
        for (const p of posts ?? []) entries.set(`/blog/${p.slug}`, p.updated_at ?? null);
        const urls = [...entries.entries()]
          .map(([path, lastmod]) => {
            const lm = lastmod ? `<lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : "";
            return `  <url><loc>${BASE_URL}${path}</loc>${lm}</url>`;
          })
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
