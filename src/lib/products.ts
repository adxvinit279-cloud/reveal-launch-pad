import { supabase } from "@/integrations/supabase/client";

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  key_features: string[];
  best_for: string | null;
  pros: string[];
  cons: string[];
  category_id: string | null;
  pricing: "free" | "freemium" | "paid" | "free_trial";
  website_url: string;
  logo_url: string | null;
  screenshots: string[];
  founder_name: string | null;
  launch_date: string;
  upvote_count: number;
  is_featured: boolean;
  is_trending: boolean;
  is_editors_pick: boolean;
  seo_title: string | null;
  seo_description: string | null;
  categories?: { slug: string; name: string } | null;
};

export const PRODUCT_SELECT =
  "id,slug,name,tagline,description,key_features,best_for,pros,cons,category_id,pricing,website_url,logo_url,screenshots,founder_name,launch_date,upvote_count,is_featured,is_trending,is_editors_pick,seo_title,seo_description,categories:category_id(slug,name)";

export async function fetchApprovedProducts(opts?: { limit?: number; categorySlug?: string; sort?: string }) {
  let q = supabase.from("products").select(PRODUCT_SELECT).eq("status", "approved");
  if (opts?.categorySlug) {
    const { data: cat } = await supabase.from("categories").select("id").eq("slug", opts.categorySlug).maybeSingle();
    if (cat) q = q.eq("category_id", cat.id);
  }
  switch (opts?.sort) {
    case "newest":
      q = q.order("launch_date", { ascending: false });
      break;
    case "upvoted":
      q = q.order("upvote_count", { ascending: false });
      break;
    case "trending":
    default:
      q = q.order("is_trending", { ascending: false }).order("upvote_count", { ascending: false });
  }
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as ProductRow[];
}

export async function fetchProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ProductRow | null;
}