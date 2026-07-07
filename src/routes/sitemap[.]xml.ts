import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/", "/products", "/categories", "/blog", "/submit-product", "/about", "/contact",
          "/privacy-policy", "/terms-and-conditions", "/disclaimer",
          "/editorial-policy", "/advertise", "/write-for-us", "/sitemap",
        ];
        const [{ data: products }, { data: cats }, { data: posts }] = await Promise.all([
          supabase.from("products").select("slug").eq("status", "approved"),
          supabase.from("categories").select("slug"),
          supabase.from("blog_posts").select("slug").eq("published", true),
        ]);
        const urls = [
          ...staticPaths,
          ...(products ?? []).map((p) => `/product/${p.slug}`),
          ...(cats ?? []).map((c) => `/category/${c.slug}`),
          ...(posts ?? []).map((p) => `/blog/${p.slug}`),
        ]
          .map((p) => `  <url><loc>${BASE_URL}${p}</loc></url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});