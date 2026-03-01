import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ContentItemPayload = {
  title: string;
  title_en?: string | null;
  slug: string;
  type: string;
  status: string;
  excerpt?: string | null;
  excerpt_en?: string | null;
  body?: string | null;
  body_en?: string | null;
  project_id?: string | null;
  cover_asset_id?: string | null;
};

export function useContentItemMutations(id: string | undefined) {
  const qc = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (payload: ContentItemPayload) => {
      const { data, error } = await supabase
        .from("content_items")
        .update({
          title: payload.title,
          title_en: payload.title_en || null,
          slug: payload.slug,
          type: payload.type,
          status: payload.status,
          excerpt: payload.excerpt || null,
          excerpt_en: payload.excerpt_en || null,
          body: payload.body || null,
          body_en: payload.body_en || null,
          project_id: payload.project_id || null,
          cover_asset_id: payload.cover_asset_id || null,
          ...(payload.status === "published" ? { published_at: new Date().toISOString() } : {}),
        })
        .eq("id", id!)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["dashboard", "content-items"] });
      qc.invalidateQueries({ queryKey: ["dashboard", "content-item", id] });
      qc.invalidateQueries({ queryKey: ["content-items", variables.type] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: ContentItemPayload) => {
      const { data, error } = await supabase
        .from("content_items")
        .insert({
          title: payload.title,
          title_en: payload.title_en || null,
          slug: payload.slug,
          type: payload.type,
          status: payload.status ?? "draft",
          excerpt: payload.excerpt || null,
          excerpt_en: payload.excerpt_en || null,
          body: payload.body || null,
          body_en: payload.body_en || null,
          project_id: payload.project_id || null,
          cover_asset_id: payload.cover_asset_id || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard", "content-items"] });
    },
  });

  return { updateMutation, createMutation };
}
