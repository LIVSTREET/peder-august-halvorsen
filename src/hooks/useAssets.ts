import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAssets(ownerType: string, ownerId?: string) {
  return useQuery({
    queryKey: ["assets", ownerType, ownerId],
    queryFn: async () => {
      let q = supabase
        .from("assets")
        .select("*")
        .eq("owner_type", ownerType)
        .order("sort_order");
      if (ownerId) q = q.eq("owner_id", ownerId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
    enabled: ownerType === "project" ? !!ownerId : true,
  });
}

export function useProjectAssets(projectId?: string) {
  return useAssets("project", projectId);
}
