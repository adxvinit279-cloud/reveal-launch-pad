import { supabase } from "@/integrations/supabase/client";

export async function checkIsAdmin(): Promise<{ user: { id: string; email: string | null } | null; isAdmin: boolean }> {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user ? { id: userData.user.id, email: userData.user.email ?? null } : null;
  if (!user) return { user: null, isAdmin: false };
  const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (error) return { user, isAdmin: false };
  return { user, isAdmin: Boolean(data) };
}

export const PRODUCT_STATUSES = ["pending", "approved", "rejected", "removed"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const STATUS_LABEL: Record<ProductStatus, string> = {
  pending: "Pending Review",
  approved: "Published",
  rejected: "Rejected",
  removed: "Removed",
};