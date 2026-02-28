import { useState, useEffect } from "react";
import { slugify } from "@/lib/slug";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { savedToast, errorToast, createdToast } from "@/lib/dashboard-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Post = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
};

type Props = {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string) => void;
};

export function PostQuickEditDialog({ post, open, onOpenChange, onCreated }: Props) {
  const qc = useQueryClient();
  const isEdit = !!post;

  const [form, setForm] = useState({ title: "", slug: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (post) {
      setForm({ title: post.title, slug: post.slug });
    } else {
      setForm({ title: "", slug: "" });
    }
  }, [open, post]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    if (isEdit) {
      const { error } = await supabase
        .from("posts")
        .update({
          title: form.title.trim() || "Uten tittel",
          slug: form.slug,
        })
        .eq("id", post!.id);
      setSubmitting(false);
      if (error) { errorToast(error.message); return; }
      savedToast();
    } else {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title: form.title.trim() || "Uten tittel",
          slug: form.slug || slugify(form.title) || "uten-tittel",
          status: "draft",
        })
        .select()
        .single();
      setSubmitting(false);
      if (error) { errorToast(error.message); return; }
      createdToast("Innlegg opprettet");
      onCreated?.(data.id);
    }

    qc.invalidateQueries({ queryKey: ["dashboard", "posts"] });
    qc.invalidateQueries({ queryKey: ["posts"] });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Rediger innlegg" : "Nytt innlegg"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="poq-title">Tittel</Label>
            <Input
              id="poq-title"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  ...(!isEdit ? { slug: slugify(title) || f.slug } : {}),
                }));
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="poq-slug">Slug</Label>
            <Input
              id="poq-slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              readOnly={!isEdit}
              className={!isEdit ? "bg-muted/50" : ""}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Lagrer…" : isEdit ? "Lagre" : "Opprett"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
