import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHero } from "@/components/page-hero";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/submit")({
  component: SubmitPage,
  head: () => ({
    meta: [
      { title: "Submit a product — ProductReveal" },
      { name: "description", content: "Submit your product, tool, plugin, or startup to ProductReveal. Every submission is reviewed by our editorial team before publishing." },
      { property: "og:title", content: "Submit a product — ProductReveal" },
      { property: "og:description", content: "Submit your product for editorial review on ProductReveal." },
    ],
    links: [{ rel: "canonical", href: "/submit" }],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  website_url: z.string().url(),
  category_id: z.string().uuid("Choose a category"),
  tagline: z.string().trim().min(10).max(140),
  description: z.string().trim().min(60).max(4000),
  pricing: z.enum(["free", "freemium", "paid", "free_trial"]),
  founder_name: z.string().trim().min(2).max(80).optional().or(z.literal("")),
  launch_date: z.string(),
});

function SubmitPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user ? { id: data.user.id } : null)); }, []);
  const { data: cats = [] } = useQuery({
    queryKey: ["cats"],
    queryFn: async () => (await supabase.from("categories").select("id,name").order("sort_order")).data ?? [],
  });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", website_url: "", category_id: "", tagline: "", description: "",
    pricing: "freemium" as const, founder_name: "", launch_date: new Date().toISOString().slice(0, 10),
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return toast.info("Please sign in to submit a product");
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.from("products").insert({
      ...parsed.data,
      founder_name: parsed.data.founder_name || null,
      submitted_by: user.id,
      status: "pending",
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setDone(true);
  }

  if (done) {
    return (
      <>
        <PageHero title="Thanks for submitting your product!" description="Our editorial team will review it before publishing." />
        <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
          <p className="text-muted-foreground">You'll get an email once your product is approved. In the meantime, explore what makers are launching.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/products"><Button>Browse products</Button></Link>
            <Link to="/"><Button variant="outline">Back home</Button></Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Submit"
        title="Share your product with the ProductReveal community"
        description="Every submission is reviewed by an editor before it goes live. We check that the site is up, the pricing is accurate, and the description reflects the product."
      />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {!user && (
          <div className="mb-6 rounded-2xl border border-border bg-card p-5 text-sm">
            <strong>Sign in required.</strong> Create an account to submit a product.{" "}
            <Link to="/auth" className="text-primary underline">Sign in</Link>
          </div>
        )}
        <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-6">
          <Field label="Product name"><Input value={form.name} onChange={(e) => set("name", e.target.value)} required maxLength={80} /></Field>
          <Field label="URL slug" hint="Lowercase letters, numbers and hyphens (e.g. my-product)">
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} required maxLength={80} />
          </Field>
          <Field label="Website URL"><Input type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} required /></Field>
          <Field label="Category">
            <Select value={form.category_id} onValueChange={(v) => set("category_id", v)}>
              <SelectTrigger><SelectValue placeholder="Choose a category" /></SelectTrigger>
              <SelectContent>
                {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Short tagline" hint="10–140 characters"><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} required maxLength={140} /></Field>
          <Field label="Full description" hint="Write at least 60 characters describing what the product does and who it's for.">
            <Textarea rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} required maxLength={4000} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Pricing">
              <Select value={form.pricing} onValueChange={(v) => set("pricing", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="free_trial">Free Trial</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Launch date"><Input type="date" value={form.launch_date} onChange={(e) => set("launch_date", e.target.value)} required /></Field>
          </div>
          <Field label="Founder name (optional)"><Input value={form.founder_name} onChange={(e) => set("founder_name", e.target.value)} maxLength={80} /></Field>
          <p className="text-xs text-muted-foreground">
            By submitting, you agree to our <Link to="/terms-and-conditions" className="text-primary underline">terms</Link> and <Link to="/editorial-policy" className="text-primary underline">editorial policy</Link>.
          </p>
          <Button type="submit" disabled={loading || !user} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? "Submitting…" : "Submit for review"}
          </Button>
        </form>
      </div>
    </>
  );
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