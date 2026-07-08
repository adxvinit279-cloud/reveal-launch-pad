import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogs,
  head: () => ({ meta: [{ title: "Blog — Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
});

function AdminBlogs() {
  const qc = useQueryClient();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin", "blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,published,published_at,created_at,author_name,tags")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function togglePublish(id: string, published: boolean) {
    const patch: { published: boolean; published_at?: string } = { published: !published };
    if (!published) patch.published_at = new Date().toISOString();
    const { error } = await supabase.from("blog_posts").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(!published ? "Published" : "Moved to draft");
    qc.invalidateQueries({ queryKey: ["admin", "blogs"] });
  }

  async function del(id: string) {
    if (!confirm("Delete this blog post permanently?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "blogs"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, edit and publish articles.</p>
        </div>
        <Link to="/admin/blog/new"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">New post</Button></Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">No posts yet. Create your first one.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.author_name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.published ? "default" : "outline"}>{p.published ? "Published" : "Draft"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.published_at ? formatDate(p.published_at) : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <Link to="/admin/blog/$id" params={{ id: p.id }}><Button size="sm" variant="outline">Edit</Button></Link>
                      <Button size="sm" onClick={() => togglePublish(p.id, p.published)} className={p.published ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"} variant={p.published ? "outline" : "default"}>
                        {p.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => del(p.id)}>Delete</Button>
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