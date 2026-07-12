// Generates public/sitemap.xml at build time so it works on any static host (Vercel, Netlify, etc.)
import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL = "https://productreveal.online";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/sitemap.xml");

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const staticPaths = [
  "/", "/products", "/categories", "/blog", "/submit-product", "/about", "/contact",
  "/privacy-policy", "/terms-and-conditions", "/disclaimer",
  "/editorial-policy", "/advertise", "/write-for-us", "/sitemap",
];

async function main() {
  const entries = new Map();
  for (const p of staticPaths) entries.set(p, null);

  if (url && key) {
    try {
      const supabase = createClient(url, key, { auth: { persistSession: false } });
      const [{ data: products }, { data: cats }, { data: posts }] = await Promise.all([
        supabase.from("products").select("slug,updated_at").eq("status", "approved"),
        supabase.from("categories").select("slug"),
        supabase.from("blog_posts").select("slug,updated_at").eq("published", true),
      ]);
      for (const p of products ?? []) entries.set(`/product/${p.slug}`, p.updated_at ?? null);
      for (const c of cats ?? []) entries.set(`/category/${c.slug}`, null);
      for (const p of posts ?? []) entries.set(`/blog/${p.slug}`, p.updated_at ?? null);
    } catch (e) {
      console.warn("[sitemap] Supabase fetch failed, writing static-only sitemap:", e?.message ?? e);
    }
  } else {
    console.warn("[sitemap] SUPABASE env vars missing, writing static-only sitemap");
  }

  const urls = [...entries.entries()]
    .map(([path, lastmod]) => {
      const lm = lastmod ? `<lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : "";
      return `  <url><loc>${BASE_URL}${path}</loc>${lm}</url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, xml, "utf8");
  console.log(`[sitemap] wrote ${entries.size} urls to ${OUT}`);
}

main().catch((e) => {
  console.error("[sitemap] fatal:", e);
  process.exit(0); // don't fail the build
});
