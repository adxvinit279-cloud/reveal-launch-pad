// Dynamic sitemap.xml — served live so new products/blog posts appear instantly.
// Public endpoint (verify_jwt = false in supabase/config.toml).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://www.productreveal.online";

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
type Entry = { path: string; lastmod?: string | null; changefreq: Freq; priority: string };

const STATIC: Entry[] = [
  { path: "/",                        changefreq: "daily",   priority: "1.0" },
  { path: "/products",                changefreq: "daily",   priority: "0.9" },
  { path: "/categories",              changefreq: "weekly",  priority: "0.8" },
  { path: "/blog",                    changefreq: "daily",   priority: "0.9" },
  { path: "/submit-product",          changefreq: "monthly", priority: "0.6" },
  { path: "/about",                   changefreq: "monthly", priority: "0.5" },
  { path: "/contact",                 changefreq: "monthly", priority: "0.5" },
  { path: "/advertise",               changefreq: "monthly", priority: "0.4" },
  { path: "/write-for-us",            changefreq: "monthly", priority: "0.4" },
  { path: "/sitemap",                 changefreq: "monthly", priority: "0.3" },
  { path: "/privacy-policy",          changefreq: "yearly",  priority: "0.3" },
  { path: "/terms-and-conditions",    changefreq: "yearly",  priority: "0.3" },
  { path: "/disclaimer",              changefreq: "yearly",  priority: "0.3" },
  { path: "/editorial-policy",        changefreq: "yearly",  priority: "0.3" },
];

function toIsoDate(v: string | null | undefined): string | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function renderUrl(e: Entry): string {
  const lm = e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : "";
  return (
    `  <url>\n` +
    `    <loc>${BASE_URL}${e.path}</loc>\n` +
    lm +
    `    <changefreq>${e.changefreq}</changefreq>\n` +
    `    <priority>${e.priority}</priority>\n` +
    `  </url>`
  );
}

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const [{ data: products }, { data: cats }, { data: posts }] = await Promise.all([
      supabase.from("products").select("slug,updated_at").eq("status", "approved"),
      supabase.from("categories").select("slug,updated_at"),
      supabase.from("blog_posts").select("slug,updated_at").eq("published", true),
    ]);

    const entries: Entry[] = [...STATIC];
    for (const p of products ?? []) entries.push({ path: `/product/${p.slug}`, lastmod: toIsoDate(p.updated_at), changefreq: "weekly", priority: "0.8" });
    for (const c of cats ?? [])     entries.push({ path: `/category/${c.slug}`, lastmod: toIsoDate((c as { updated_at?: string }).updated_at), changefreq: "weekly", priority: "0.7" });
    for (const p of posts ?? [])    entries.push({ path: `/blog/${p.slug}`,   lastmod: toIsoDate(p.updated_at), changefreq: "monthly", priority: "0.7" });

    // Dedupe by path (keep first occurrence).
    const seen = new Set<string>();
    const unique = entries.filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)));

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      unique.map(renderUrl).join("\n") + "\n" +
      `</urlset>\n`;

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
