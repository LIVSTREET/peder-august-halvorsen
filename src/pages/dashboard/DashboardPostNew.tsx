import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardPostNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("posts")
      .insert({
        title: title || "Uten tittel",
        slug: slug || slugify(title) || "uten-tittel",
        status: "draft",
      })
      .select()
      .single();
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate(`/dashboard/posts/${data.id}`);
  }

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="font-display text-2xl font-bold text-foreground">Nytt innlegg</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Tittel</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Oppretter…" : "Opprett"}
        </Button>
      </form>
    </div>
  );
}
