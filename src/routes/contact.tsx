import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — ProductReveal" },
      { name: "description", content: "Get in touch with ProductReveal for product submissions, corrections, partnerships, advertising or general questions." },
      { property: "og:title", content: "Contact ProductReveal" },
      { property: "og:description", content: "Reach the ProductReveal team for submissions, corrections, partnerships and advertising." },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/contact` }],
  }),
});

const REASONS = ["Product submission", "Correction", "Partnership request", "Advertising inquiry", "General question"];

function Contact() {
  const [f, setF] = useState({ name: "", email: "", reason: REASONS[0], message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(f);
    setLoading(false);
    if (error) return toast.error(error.message);
    setDone(true);
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the ProductReveal team"
        description={`We try to respond to genuine inquiries as soon as possible. You can also email us at ${SITE.email}.`}
      />
      <div className="mx-auto grid max-w-4xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <aside className="space-y-4 text-sm text-muted-foreground lg:col-span-1">
          <div>
            <h3 className="font-display font-semibold text-foreground">Reasons to contact</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {REASONS.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Email</h3>
            <p className="mt-1">{SITE.email}</p>
          </div>
        </aside>
        <div className="lg:col-span-2">
          {done ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="font-display text-2xl font-bold">Thanks — message received.</h2>
              <p className="mt-2 text-muted-foreground">We aim to reply within a few business days.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label className="text-sm">Your name</Label><Input required minLength={1} maxLength={120} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
                <div><Label className="text-sm">Email</Label><Input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
              </div>
              <div>
                <Label className="text-sm">Reason</Label>
                <Select value={f.reason} onValueChange={(v) => setF({ ...f, reason: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-sm">Message</Label><Textarea required rows={6} minLength={10} maxLength={5000} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
              <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}