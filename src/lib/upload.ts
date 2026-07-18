import { supabase } from "@/integrations/supabase/client";

export async function uploadMedia(file: File, prefix = "submissions"): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${prefix}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("product-media").createSignedUrl
    ? await supabase.storage.from("product-media").createSignedUrl(path, 60 * 60 * 24 * 365 * 5)
    : { data: null };
  if (data?.signedUrl) return data.signedUrl;
  return supabase.storage.from("product-media").getPublicUrl(path).data.publicUrl;
}

// Backwards compat alias used elsewhere in the codebase.
export const uploadProductMedia = uploadMedia;

export function wordCount(text: string): number {
  const plain = text.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  return plain.trim().split(/\s+/).filter(Boolean).length;
}