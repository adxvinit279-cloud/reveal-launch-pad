// Dynamic sitemap.xml — served live so new products/blog posts appear instantly.
// Public endpoint (verify_jwt = false in supabase/config.toml).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://productreveal.online";

const STATIC_PATHS = [
  "/", "/products", "/categories", "/blog", "/submit-product", "/about", "/contact",
  "/privacy-policy", "/terms-and-conditions", "/disclaimer",
  "/editorial-policy", "/advertise", "/write-for-us", "/sitemap",
];

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const [{ data: products }, { data: cats }, { data: posts }] = await Promise.all([
      supabase.from("products").select("slug,updated_at").eq("status", "approved"),
      supabase.from("categories").select("slug"),
      supabase.from("blog_posts").select("slug,updated_at").eq("published", true),
    ]);

    const entries = new Map<string, string | null>();
    for (const p of STATIC_PATHS) entries.set(p, null);
    for (const p of products ?? []) entries.set(`/product/${p.slug}`, p.updated_at ?? null);
    for (const c of cats ?? []) entries.set(`/category/${c.slug}`, null);
    for (const p of posts ?? []) entries.set(`/blog/${p.slug}`, p.updated_at ?? null);

    const urls = [...entries.entries()]
      .map(([path, lastmod]) => {
        const lm = lastmod ? `<lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : "";
        return `  <url><loc>${BASE_URL}${path}</loc>${lm}</url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(`sitemap error: ${(e as Error).message}`, { status: 500 });
  }
});
