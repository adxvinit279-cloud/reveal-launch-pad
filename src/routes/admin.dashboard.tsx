import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_STATUSES, STATUS_LABEL, type ProductStatus } from "@/lib/admin";
import { formatDate } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — ProductReveal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminDashboard() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<ProductStatus>("pending");
  const [q, setQ] = useState("");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "products", status],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,slug,tagline,status,pricing,contact_email,founder_name,created_at,launch_date,featured_image")
        .eq("status", status)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(t) || r.slug.toLowerCase().includes(t) || (r.founder_name ?? "").toLowerCase().includes(t));
  }, [rows, q]);

  async function quickAction(id: string, next: ProductStatus) {
    const { error } = await supabase.from("products").update({ status: next }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${STATUS_LABEL[next]}`);
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
  }

  async function del(id: string) {
    if (!confirm("Delete this submission permanently?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Submissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review, edit, publish, and moderate product submissions.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {PRODUCT_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${status === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
        <Input placeholder="Search by name, slug, founder…" value={q} onChange={(e) => setQ(e.target.value)} className="ml-auto max-w-xs" />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No submissions in this bucket.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {r.featured_image ? (
                        <img src={r.featured_image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-brand-gradient" />
                      )}
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground">/{r.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{r.founder_name ?? "—"}</div>
                    <div className="text-xs">{r.contact_email ?? ""}</div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline">{STATUS_LABEL[r.status as ProductStatus]}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <Link to="/admin/product/$id" params={{ id: r.id }}>
                        <Button size="sm" variant="outline">Review / Edit</Button>
                      </Link>
                      {status !== "approved" && (
                        <Button size="sm" onClick={() => quickAction(r.id, "approved")} className="bg-primary text-primary-foreground hover:bg-primary/90">Publish</Button>
                      )}
                      {status !== "rejected" && (
                        <Button size="sm" variant="outline" onClick={() => quickAction(r.id, "rejected")}>Reject</Button>
                      )}
                      {status !== "removed" && (
                        <Button size="sm" variant="outline" onClick={() => quickAction(r.id, "removed")}>Remove</Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => del(r.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}