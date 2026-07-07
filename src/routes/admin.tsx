import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/admin";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Admin — ProductReveal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminLayout() {
  const nav = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { user, isAdmin } = await checkIsAdmin();
      if (!mounted) return;
      setEmail(user?.email ?? null);
      setState(isAdmin ? "ok" : "denied");
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      checkIsAdmin().then(({ user, isAdmin }) => {
        setEmail(user?.email ?? null);
        setState(isAdmin ? "ok" : "denied");
      });
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isLogin = path.startsWith("/admin/login");

  if (state === "loading") {
    return <div className="mx-auto max-w-md p-10 text-center text-sm text-muted-foreground">Checking access…</div>;
  }
  if (state === "denied") {
    if (isLogin) return <Outlet />;
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="font-display text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with an authorized admin account to continue.</p>
        <Link to="/admin/login"><Button className="mt-6">Go to admin login</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="font-display text-lg font-bold">ProductReveal Admin</Link>
            <nav className="hidden gap-4 text-sm text-muted-foreground sm:flex">
              <Link to="/admin/dashboard" className="hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>Submissions</Link>
              <Link to="/" className="hover:text-foreground">View site</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
            <Button size="sm" variant="outline" onClick={async () => { await supabase.auth.signOut(); nav({ to: "/admin/login" }); }}>Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><Outlet /></main>
    </div>
  );
}