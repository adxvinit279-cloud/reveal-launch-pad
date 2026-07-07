import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { uploadProductMedia } from "@/lib/upload";
import { STATUS_LABEL, type ProductStatus } from "@/lib/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/product/$id")({
  component: AdminProductEditor,
  head: () => ({ meta: [{ title: "Edit Product — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

type P = Record<string, unknown> & {
  id: string; name: string; slug: string; tagline: string; description: string;
  website_url: string; category_id: string | null; pricing: "free" | "freemium" | "paid" | "free_trial";
  featured_image: string | null; logo_url: string | null; gallery_images: string[];
  key_features: string[]; pros: string[]; cons: string[]; tags: string[];
  founder_name: string | null; contact_email: string | null; launch_date: string;
  seo_title: string | null; seo_description: string | null; admin_notes: string | null;
  demo_video_url: string | null; twitter_url: string | null; linkedin_url: string | null;
  coupon_code: string | null; status: ProductStatus;
};

function AdminProductEditor() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { data: cats = [] } = useQuery({
    queryKey: ["cats"],
    queryFn: async () => (await supabase.from("categories").select("id,name").order("sort_order")).data ?? [],
  });
  const [p, setP] = useState<P | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => setP(data as P | null));
  }, [id]);

  if (!p) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const upd = <K extends keyof P>(k: K, v: P[K]) => setP((prev) => (prev ? { ...prev, [k]: v } : prev));

  async function save(nextStatus?: ProductStatus) {
    if (!p) return;
    setLoading(true);
    const payload: Record<string, unknown> = {
      name: p.name, slug: p.slug, tagline: p.tagline, description: p.description,
      website_url: p.website_url, category_id: p.category_id, pricing: p.pricing,
      featured_image: p.featured_image, logo_url: p.logo_url, gallery_images: p.gallery_images,
      key_features: p.key_features, pros: p.pros, cons: p.cons, tags: p.tags,
      founder_name: p.founder_name, contact_email: p.contact_email, launch_date: p.launch_date,
      seo_title: p.seo_title, seo_description: p.seo_description, admin_notes: p.admin_notes,
      demo_video_url: p.demo_video_url, twitter_url: p.twitter_url, linkedin_url: p.linkedin_url,
      coupon_code: p.coupon_code,
    };
    if (nextStatus) payload.status = nextStatus;
    const { error } = await supabase.from("products").update(payload).eq("id", p.id);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(nextStatus ? `Saved & marked ${STATUS_LABEL[nextStatus]}` : "Saved");
    if (nextStatus) nav({ to: "/admin/dashboard" });
  }

  async function del() {
    if (!confirm("Delete this submission permanently?")) return;
    if (!p) return;
    const { error } = await supabase.from("products").delete().eq("id", p!.id);
    if (error) return toast.error(error.message);
    nav({ to: "/admin/dashboard" });
  }

  async function replaceFeatured(file: File) {
    const url = await uploadProductMedia(file, "featured");
    upd("featured_image", url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/dashboard" className="text-sm text-muted-foreground hover:underline">← Back</Link>
          <h1 className="font-display text-2xl font-bold">{p.name}</h1>
          <p className="text-xs text-muted-foreground">Status: {STATUS_LABEL[p.status]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => save()} disabled={loading}>Save Changes</Button>
          <a href={`/product/${p.slug}`} target="_blank" rel="noreferrer"><Button variant="outline">Preview</Button></a>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => save("approved")} disabled={loading}>Publish</Button>
          <Button variant="outline" onClick={() => save("rejected")} disabled={loading}>Reject</Button>
          <Button variant="outline" onClick={() => save("removed")} disabled={loading}>Remove</Button>
          <Button variant="ghost" className="text-destructive" onClick={del}>Delete</Button>
        </div>
      </div>

      <Card title="Basic information">
        <Grid>
          <F label="Product title"><Input value={p.name} onChange={(e) => upd("name", e.target.value)} /></F>
          <F label="Slug"><Input value={p.slug} onChange={(e) => upd("slug", e.target.value)} /></F>
          <F label="Tagline"><Input value={p.tagline} onChange={(e) => upd("tagline", e.target.value)} /></F>
          <F label="Website URL"><Input value={p.website_url} onChange={(e) => upd("website_url", e.target.value)} /></F>
          <F label="Category">
            <Select value={p.category_id ?? ""} onValueChange={(v) => upd("category_id", v)}>
              <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
              <SelectContent>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </F>
          <F label="Pricing type">
          <Select value={p.pricing} onValueChange={(v) => upd("pricing", v as P["pricing"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["free", "freemium", "paid", "free_trial"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </F>
          <F label="Founder / company"><Input value={p.founder_name ?? ""} onChange={(e) => upd("founder_name", e.target.value)} /></F>
          <F label="Contact email"><Input value={p.contact_email ?? ""} onChange={(e) => upd("contact_email", e.target.value)} /></F>
          <F label="Launch date"><Input type="date" value={p.launch_date} onChange={(e) => upd("launch_date", e.target.value)} /></F>
        </Grid>
      </Card>

      <Card title="Media">
        <F label="Featured image">
          {p.featured_image && <img src={p.featured_image} alt="" className="mb-2 h-32 w-32 rounded-lg object-cover" />}
          <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) replaceFeatured(f); }} />
          <Input className="mt-2" value={p.featured_image ?? ""} onChange={(e) => upd("featured_image", e.target.value)} placeholder="Image URL" />
        </F>
      </Card>

      <Card title="Full description">
        <Textarea rows={14} value={p.description} onChange={(e) => upd("description", e.target.value)} />
      </Card>

      <Card title="Key features">
        {[0, 1, 2, 3, 4].map((i) => (
          <F key={i} label={`Feature ${i + 1}`}>
            <Input value={p.key_features[i] ?? ""} onChange={(e) => {
              const arr = [...p.key_features]; arr[i] = e.target.value; upd("key_features", arr);
            }} />
          </F>
        ))}
      </Card>

      <Card title="SEO">
        <F label="SEO title"><Input value={p.seo_title ?? ""} onChange={(e) => upd("seo_title", e.target.value)} /></F>
        <F label="SEO meta description"><Textarea rows={3} value={p.seo_description ?? ""} onChange={(e) => upd("seo_description", e.target.value)} /></F>
      </Card>

      <Card title="Tags, pros & cons">
        <F label="Tags (comma separated)">
          <Input value={p.tags.join(", ")} onChange={(e) => upd("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} />
        </F>
        <Grid>
          <F label="Pros (one per line)">
            <Textarea rows={5} value={p.pros.join("\n")} onChange={(e) => upd("pros", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />
          </F>
          <F label="Cons (one per line)">
            <Textarea rows={5} value={p.cons.join("\n")} onChange={(e) => upd("cons", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />
          </F>
        </Grid>
      </Card>

      <Card title="Editor notes">
        <Textarea rows={4} value={p.admin_notes ?? ""} onChange={(e) => upd("admin_notes", e.target.value)} placeholder="Internal notes about this submission" />
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}