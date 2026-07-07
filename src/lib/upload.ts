import { supabase } from "@/integrations/supabase/client";

export async function uploadProductMedia(file: File, prefix = "submissions"): Promise<string> {
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
  // Prefer signed URL (bucket is private). Fall back to public URL if bucket becomes public later.
  if (data?.signedUrl) return data.signedUrl;
  return supabase.storage.from("product-media").getPublicUrl(path).data.publicUrl;
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}