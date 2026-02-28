import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";
import { CONTENT_TYPES } from "@/lib/content-types";
import { errorToast } from "@/lib/dashboard-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function DashboardContentNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"work" | "build" | "archive">("build");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const s = slug || slugify(title) || "innlegg";
    const { data, error } = await supabase
      .from("content_items")
      .insert({ title: title || "Uten tittel", slug: s, type, status: "draft" } as any)
      .select()
      .single();
    setLoading(false);
    if (error) { errorToast(error.message); return; }
    navigate(`/dashboard/content/${data.id}`);
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="font-display text-2xl font-bold text-foreground">Nytt innhold</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Tittel</Label>
          <Input id="title" value={title} onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={slug} readOnly className="bg-muted/50" />
          <p className="text-xs text-muted-foreground">Genereres automatisk fra tittel.</p>
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Oppretter…" : "Opprett og rediger"}</Button>
      </form>
    </div>
  );
}
