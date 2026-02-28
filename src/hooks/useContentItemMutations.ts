import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ContentItemPayload = {
  title: string;
  slug: string;
  type: string;
  status: string;
  excerpt?: string | null;
  body?: string | null;
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
          slug: payload.slug,
          type: payload.type,
          status: payload.status,
          excerpt: payload.excerpt || null,
          body: payload.body || null,
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
          slug: payload.slug,
          type: payload.type,
          status: payload.status ?? "draft",
          excerpt: payload.excerpt || null,
          body: payload.body || null,
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
