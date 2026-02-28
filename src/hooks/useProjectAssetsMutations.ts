import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "public-assets";

export function useProjectAssetsMutations(projectId: string | undefined) {
  const qc = useQueryClient();

  const insertMutation = useMutation({
    mutationFn: async ({
      storagePath,
      alt,
      width,
      height,
      sortOrder,
    }: {
      storagePath: string;
      alt?: string | null;
      width?: number | null;
      height?: number | null;
      sortOrder: number;
    }) => {
      if (!projectId) throw new Error("Missing projectId");
      const { data, error } = await supabase
        .from("assets")
        .insert({
          owner_type: "project",
          owner_id: projectId,
          kind: "screenshot",
          storage_bucket: BUCKET,
          storage_path: storagePath,
          alt: alt ?? null,
          width: width ?? null,
          height: height ?? null,
          sort_order: sortOrder,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets", "project", projectId] });
    },
  });

  const softDeleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from("assets")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets", "project", projectId] });
    },
  });

  const undoDeleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase
        .from("assets")
        .update({ deleted_at: null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets", "project", projectId] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, sort_order }: { id: string; sort_order: number }) => {
      const { error } = await supabase
        .from("assets")
        .update({ sort_order })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets", "project", projectId] });
    },
  });

  return {
    insertAsset: insertMutation.mutateAsync,
    softDeleteAsset: softDeleteMutation.mutateAsync,
    undoDeleteAsset: undoDeleteMutation.mutateAsync,
    reorderAsset: reorderMutation.mutateAsync,
    isInserting: insertMutation.isPending,
    isDeleting: softDeleteMutation.isPending,
  };
}
