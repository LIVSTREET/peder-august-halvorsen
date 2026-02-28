import { useState, useEffect } from "react";
import { slugify } from "@/lib/slug";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { savedToast, errorToast, createdToast } from "@/lib/dashboard-toast";
import { CONTENT_TYPES } from "@/lib/content-types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
};

type Props = {
  item: ContentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string) => void;
};

export function ContentQuickEditDialog({ item, open, onOpenChange, onCreated }: Props) {
  const qc = useQueryClient();
  const isEdit = !!item;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "build" as "work" | "build" | "archive",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setForm({ title: item.title, slug: item.slug, type: item.type as typeof form.type });
    } else {
      setForm({ title: "", slug: "", type: "build" });
    }
  }, [open, item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    if (isEdit) {
      const { error } = await supabase
        .from("content_items")
        .update({
          title: form.title.trim() || "Uten tittel",
          slug: form.slug,
          type: form.type,
        } as any)
        .eq("id", item!.id);
      setSubmitting(false);
      if (error) { errorToast(error.message); return; }
      savedToast();
    } else {
      const { data, error } = await supabase
        .from("content_items")
        .insert({
          title: form.title.trim() || "Uten tittel",
          slug: form.slug || slugify(form.title) || "innlegg",
          type: form.type,
          status: "draft",
        } as any)
        .select()
        .single();
      setSubmitting(false);
      if (error) { errorToast(error.message); return; }
      createdToast("Innhold opprettet");
      onCreated?.(data.id);
    }

    qc.invalidateQueries({ queryKey: ["dashboard", "content"] });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Rediger innhold" : "Nytt innhold"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cq-title">Tittel</Label>
            <Input
              id="cq-title"
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
            <Label htmlFor="cq-slug">Slug</Label>
            <Input
              id="cq-slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              readOnly={!isEdit}
              className={!isEdit ? "bg-muted/50" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v as typeof form.type }))}
              disabled={isEdit}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
