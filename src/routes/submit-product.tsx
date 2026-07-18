import { SITE } from "@/lib/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHero } from "@/components/page-hero";
import { RichTextEditor } from "@/components/rich-text-editor";
import { supabase } from "@/integrations/supabase/client";
import { uploadProductMedia, wordCount } from "@/lib/upload";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/submit-product")({
  component: SubmitProductPage,
  head: () => ({
    meta: [
      { title: "Submit a Product — ProductReveal" },
      { name: "description", content: "Submit your product, SaaS, AI tool, or startup to ProductReveal. Free listing after editorial review — no account required." },
      { property: "og:title", content: "Submit a Product — ProductReveal" },
      { property: "og:description", content: "Free product submission — reviewed by our editorial team." },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/submit-product` }],
  }),
});

const urlOk = z.string().url();
const optionalUrl = z.union([z.literal(""), z.string().url()]);

type FormState = {
  name: string; slug: string; tagline: string; website_url: string;
  category_id: string; pricing: "free" | "freemium" | "paid" | "free_trial";
  description: string;
  key_features: [string, string, string, string, string];
  founder_name: string; contact_email: string; launch_date: string;
  demo_video_url: string; twitter_url: string; linkedin_url: string;
  tags: string; coupon_code: string; pros: string; cons: string;
  hp: string; // honeypot
};

function SubmitProductPage() {
  const { data: cats = [] } = useQuery({
    queryKey: ["cats"],
    queryFn: async () => (await supabase.from("categories").select("id,name").order("sort_order")).data ?? [],
  });
  const [featured, setFeatured] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "", slug: "", tagline: "", website_url: "", category_id: "", pricing: "freemium",
    description: "", key_features: ["", "", "", "", ""],
    founder_name: "", contact_email: "", launch_date: new Date().toISOString().slice(0, 10),
    demo_video_url: "", twitter_url: "", linkedin_url: "",
    tags: "", coupon_code: "", pros: "", cons: "", hp: "",
  });
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const wc = wordCount(form.description);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.hp) return; // spam bot
    if (!form.name.trim()) return toast.error("Product name is required");
    if (!/^[a-z0-9-]+$/.test(form.slug)) return toast.error("Slug must be lowercase letters, numbers and hyphens");
    if (!featured) return toast.error("Featured image is required");
    if (!form.tagline.trim()) return toast.error("Tagline is required");
    if (!urlOk.safeParse(form.website_url).success) return toast.error("Enter a valid website URL");
    if (!form.category_id) return toast.error("Choose a category");
    if (wc < 500) return toast.error(`Description must be at least 500 words (currently ${wc}).`);
    if (wc > 5000) return toast.error(`Description cannot exceed 5000 words (currently ${wc}).`);
    if (form.key_features.some((f) => !f.trim())) return toast.error("All 5 key features are required");
    if (!form.founder_name.trim()) return toast.error("Founder or company name is required");
    if (!z.string().email().safeParse(form.contact_email).success) return toast.error("Enter a valid contact email");
    for (const [key, val] of [["demo_video_url", form.demo_video_url], ["twitter_url", form.twitter_url], ["linkedin_url", form.linkedin_url]] as const) {
      if (!optionalUrl.safeParse(val).success) return toast.error(`Enter a valid ${key.replace(/_/g, " ")}`);
    }
    setLoading(true);
    try {
      const featured_image = await uploadProductMedia(featured, "featured");
      const logo_url = logo ? await uploadProductMedia(logo, "logos") : null;
      const gallery_images = gallery.length
        ? await Promise.all(gallery.map((g) => uploadProductMedia(g, "gallery")))
        : [];
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        tagline: form.tagline.trim(),
        website_url: form.website_url.trim(),
        category_id: form.category_id,
        pricing: form.pricing,
        description: form.description.trim(),
        key_features: form.key_features.map((f) => f.trim()),
        founder_name: form.founder_name.trim(),
        contact_email: form.contact_email.trim(),
        launch_date: form.launch_date,
        featured_image,
        logo_url,
        gallery_images,
        demo_video_url: form.demo_video_url.trim() || null,
        twitter_url: form.twitter_url.trim() || null,
        linkedin_url: form.linkedin_url.trim() || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        coupon_code: form.coupon_code.trim() || null,
        pros: form.pros.split("\n").map((p) => p.trim()).filter(Boolean),
        cons: form.cons.split("\n").map((p) => p.trim()).filter(Boolean),
        status: "pending" as const,
        submitted_by: null,
        upvote_count: 0,
        is_featured: false, is_trending: false, is_editors_pick: false,
      };
      const { error } = await supabase.from("products").insert(payload);
      if (error) throw error;
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <PageHero title="Submission received" description="Thank you for submitting your product to ProductReveal." />
        <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="text-base text-foreground">
              Thank you for submitting your product to ProductReveal. Your submission has been received and will be reviewed by our editorial team before publishing.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              We'll email you at the address you provided once the review is complete.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/products"><Button>Browse products</Button></Link>
              <Link to="/"><Button variant="outline">Back home</Button></Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Submit"
        title="Share your product with ProductReveal"
        description="Free listing. No account required. Every submission is reviewed by a human editor before it goes live."
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <form onSubmit={submit} className="space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <input type="text" name="website_confirm" value={form.hp} onChange={(e) => set("hp", e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <Section title="Basic information">
            <Grid>
              <Field label="Product name *"><Input value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={80} required /></Field>
              <Field label="Product slug *" hint="lowercase-with-hyphens">
                <Input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} maxLength={80} required />
              </Field>
              <Field label="Tagline *" hint="Short one-liner">
                <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} maxLength={140} required />
              </Field>
              <Field label="Website URL *"><Input type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} required /></Field>
              <Field label="Category *">
                <Select value={form.category_id} onValueChange={(v) => set("category_id", v)}>
                  <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
                  <SelectContent>
                    {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Pricing type *">
                <Select value={form.pricing} onValueChange={(v) => set("pricing", v as FormState["pricing"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="free_trial">Free Trial</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </Grid>
          </Section>

          <Section title="Media">
            <Field label="Featured image *" hint="Used as the OG/social preview">
              <Input type="file" accept="image/*" onChange={(e) => setFeatured(e.target.files?.[0] ?? null)} required />
              {featured && <p className="mt-1 text-xs text-muted-foreground">Selected: {featured.name}</p>}
            </Field>
            <Field label="Product logo (optional)">
              <Input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
            </Field>
            <Field label="Gallery images (optional)">
              <Input type="file" accept="image/*" multiple onChange={(e) => setGallery(Array.from(e.target.files ?? []))} />
              {gallery.length > 0 && <p className="mt-1 text-xs text-muted-foreground">{gallery.length} file(s) selected</p>}
            </Field>
          </Section>

          <Section title="Full description">
            <Field label={`Product introduction * — ${wc} words`} hint="Minimum 500 words, maximum 5000 words. Format with bold, italics, lists, quotes, and links. Headings are added by our editors during review.">
              <RichTextEditor value={form.description} onChange={(html) => set("description", html)} restricted minHeight={320} />
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full ${wc >= 500 && wc <= 5000 ? "bg-primary" : "bg-destructive/60"}`} style={{ width: `${Math.min(100, (wc / 500) * 100)}%` }} />
              </div>
            </Field>
          </Section>

          <Section title="5 Key features *">
            {form.key_features.map((v, i) => (
              <Field key={i} label={`Feature ${i + 1}`}>
                <Input value={v} onChange={(e) => {
                  const arr = [...form.key_features] as FormState["key_features"];
                  arr[i] = e.target.value;
                  set("key_features", arr);
                }} required />
              </Field>
            ))}
          </Section>

          <Section title="Maker & contact">
            <Grid>
              <Field label="Founder / company name *"><Input value={form.founder_name} onChange={(e) => set("founder_name", e.target.value)} required /></Field>
              <Field label="Contact email *"><Input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} required /></Field>
              <Field label="Launch date *"><Input type="date" value={form.launch_date} onChange={(e) => set("launch_date", e.target.value)} required /></Field>
            </Grid>
          </Section>

          <Section title="Extras (optional)">
            <Grid>
              <Field label="YouTube demo URL"><Input type="url" value={form.demo_video_url} onChange={(e) => set("demo_video_url", e.target.value)} /></Field>
              <Field label="Twitter / X URL"><Input type="url" value={form.twitter_url} onChange={(e) => set("twitter_url", e.target.value)} /></Field>
              <Field label="LinkedIn URL"><Input type="url" value={form.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} /></Field>
              <Field label="Coupon code / offer"><Input value={form.coupon_code} onChange={(e) => set("coupon_code", e.target.value)} /></Field>
            </Grid>
            <Field label="Tags" hint="Comma separated"><Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="ai, productivity, saas" /></Field>
            <Grid>
              <Field label="Short pros" hint="One per line"><Textarea rows={4} value={form.pros} onChange={(e) => set("pros", e.target.value)} /></Field>
              <Field label="Short cons" hint="One per line"><Textarea rows={4} value={form.cons} onChange={(e) => set("cons", e.target.value)} /></Field>
            </Grid>
          </Section>

          <p className="text-xs text-muted-foreground">
            By submitting, you agree to our <Link to="/terms-and-conditions" className="text-primary underline">terms</Link> and <Link to="/editorial-policy" className="text-primary underline">editorial policy</Link>. Submissions are moderated and not auto-published.
          </p>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? "Submitting…" : "Submit for review"}
          </Button>
        </form>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}