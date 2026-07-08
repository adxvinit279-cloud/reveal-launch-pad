import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog/$id")({
  component: BlogEditor,
  head: () => ({ meta: [{ title: "Edit post — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author_name: string;
  author_bio: string;
  tags: string; // comma separated
  seo_title: string;
  seo_description: string;
  published: boolean;
};

const EMPTY: Form = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  author_name: "ProductReveal Editorial",
  author_bio: "",
  tags: "",
  seo_title: "",
  seo_description: "",
  published: false,
};

function BlogEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [form, setForm] = useState<Form>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
      if (error) toast.error(error.message);
      if (data) {
        setForm({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          cover_image_url: data.cover_image_url ?? "",
          author_name: data.author_name ?? "",
          author_bio: data.author_bio ?? "",
          tags: (data.tags ?? []).join(", "),
          seo_title: data.seo_title ?? "",
          seo_description: data.seo_description ?? "",
          published: Boolean(data.published),
        });
      }
      setLoading(false);
    })();
  }, [id, isNew]);

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(publish?: boolean) {
    const willPublish = typeof publish === "boolean" ? publish : form.published;
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.content.trim()) return toast.error("Content is required");
    const slug = form.slug.trim() || slugify(form.title);
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim(),
      content: form.content,
      cover_image_url: form.cover_image_url.trim() || null,
      author_name: form.author_name.trim() || "ProductReveal Editorial",
      author_bio: form.author_bio.trim() || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      published: willPublish,
      ...(willPublish ? { published_at: new Date().toISOString() } : {}),
    };
    const res = isNew
      ? await supabase.from("blog_posts").insert(payload).select("id").maybeSingle()
      : await supabase.from("blog_posts").update(payload).eq("id", id).select("id").maybeSingle();
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(willPublish ? "Published" : "Saved");
    navigate({ to: "/admin/blogs" });
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{isNew ? "New post" : "Edit post"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Write, preview and publish an article.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={saving} onClick={() => save(false)}>Save draft</Button>
          <Button disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => save(true)}>Publish</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Field label="Title"><Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Article title" /></Field>
          <Field label="Slug" hint="URL path — leave blank to auto-generate from title.">
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="my-article-slug" />
          </Field>
          <Field label="Excerpt" hint="Short summary shown on blog listing and social previews.">
            <Textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </Field>
          <Field label="Content (Markdown supported: ## headings, paragraphs)">
            <Textarea rows={18} value={form.content} onChange={(e) => set("content", e.target.value)} className="font-mono text-sm" />
          </Field>
        </div>
        <aside className="space-y-4">
          <Field label="Featured image URL">
            <Input value={form.cover_image_url} onChange={(e) => set("cover_image_url", e.target.value)} placeholder="https://…" />
            {form.cover_image_url && <img src={form.cover_image_url} alt="" className="mt-2 h-32 w-full rounded-lg object-cover" />}
          </Field>
          <Field label="Tags / category" hint="Comma-separated.">
            <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="guides, ai-tools" />
          </Field>
          <Field label="Author name"><Input value={form.author_name} onChange={(e) => set("author_name", e.target.value)} /></Field>
          <Field label="Author bio"><Textarea rows={2} value={form.author_bio} onChange={(e) => set("author_bio", e.target.value)} /></Field>
          <Field label="SEO title"><Input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} /></Field>
          <Field label="SEO meta description"><Textarea rows={3} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} /></Field>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}