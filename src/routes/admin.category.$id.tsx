import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/upload";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/category/$id")({
  component: CategoryEditor,
  head: () => ({ meta: [{ title: "Edit category — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

type Faq = { q: string; a: string };
type Form = {
  name: string; slug: string; tagline: string; description: string;
  featured_image: string; icon: string; sort_order: number;
  seo_title: string; seo_description: string; faqs: Faq[];
};
const EMPTY: Form = { name: "", slug: "", tagline: "", description: "", featured_image: "", icon: "", sort_order: 0, seo_title: "", seo_description: "", faqs: [{ q: "", a: "" }] };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function CategoryEditor() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const isNew = id === "new";
  const [form, setForm] = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    supabase.from("categories").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          name: data.name, slug: data.slug, tagline: data.tagline ?? "", description: data.description ?? "",
          featured_image: data.featured_image ?? "", icon: data.icon ?? "", sort_order: data.sort_order ?? 0,
          seo_title: data.seo_title ?? "", seo_description: data.seo_description ?? "",
          faqs: Array.isArray(data.faqs) && data.faqs.length ? (data.faqs as Faq[]) : [{ q: "", a: "" }],
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set<K extends keyof Form>(k: K, v: Form[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function uploadImg(file: File) {
    try { set("featured_image", await uploadMedia(file, "category")); }
    catch (e) { toast.error((e as Error).message); }
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Name is required");
    const slug = form.slug.trim() || slugify(form.name);
    setSaving(true);
    const payload = {
      name: form.name.trim(), slug, tagline: form.tagline.trim(), description: form.description.trim(),
      featured_image: form.featured_image.trim() || null, icon: form.icon.trim() || null,
      sort_order: form.sort_order || 0,
      seo_title: form.seo_title.trim() || null, seo_description: form.seo_description.trim() || null,
      faqs: form.faqs.filter((f) => f.q.trim() && f.a.trim()),
    };
    const res = isNew
      ? await supabase.from("categories").insert(payload).select("id").maybeSingle()
      : await supabase.from("categories").update(payload).eq("id", id).select("id").maybeSingle();
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    nav({ to: "/admin/categories" });
  }

  async function del() {
    if (isNew) return;
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    nav({ to: "/admin/categories" });
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const updateFaq = (i: number, k: keyof Faq, v: string) => {
    const next = [...form.faqs]; next[i] = { ...next[i], [k]: v }; set("faqs", next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/categories" className="text-sm text-muted-foreground hover:underline">← Back</Link>
          <h1 className="font-display text-2xl font-bold">{isNew ? "New category" : `Edit: ${form.name}`}</h1>
        </div>
        <div className="flex gap-2">
          {!isNew && <Button variant="ghost" className="text-destructive" onClick={del}>Delete</Button>}
          <Button onClick={save} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
        </div>
      </div>

      <Card title="Basics">
        <Grid>
          <F label="Name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></F>
          <F label="Slug" hint="URL: /category/your-slug"><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(form.name)} /></F>
          <F label="Tagline"><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></F>
          <F label="Sort order"><Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value || "0", 10))} /></F>
        </Grid>
        <F label="Description"><Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} /></F>
      </Card>

      <Card title="Image & icon">
        <F label="Featured image">
          {form.featured_image && <img src={form.featured_image} alt="" className="mb-2 h-32 w-full rounded-lg object-cover" />}
          <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImg(f); }} />
          <Input className="mt-2" value={form.featured_image} onChange={(e) => set("featured_image", e.target.value)} placeholder="Image URL" />
        </F>
        <F label="Icon (emoji or short label, optional)"><Input value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="🚀" /></F>
      </Card>

      <Card title="SEO">
        <F label="SEO title"><Input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} /></F>
        <F label="SEO meta description"><Textarea rows={3} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} /></F>
      </Card>

      <Card title="FAQs">
        <div className="space-y-3">
          {form.faqs.map((f, i) => (
            <div key={i} className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">FAQ {i + 1}</span>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => set("faqs", form.faqs.filter((_, j) => j !== i))}>Remove</Button>
              </div>
              <Input className="mt-2" placeholder="Question" value={f.q} onChange={(e) => updateFaq(i, "q", e.target.value)} />
              <Textarea className="mt-2" rows={3} placeholder="Answer" value={f.a} onChange={(e) => updateFaq(i, "a", e.target.value)} />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => set("faqs", [...form.faqs, { q: "", a: "" }])}>+ Add FAQ</Button>
        </div>
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
function Grid({ children }: { children: React.ReactNode }) { return <div className="grid gap-4 sm:grid-cols-2">{children}</div>; }
function F({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-sm font-medium">{label}</Label>{children}{hint && <p className="text-xs text-muted-foreground">{hint}</p>}</div>;
}