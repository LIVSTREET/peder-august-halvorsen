import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// `projects_public` is a view that mirrors the projects table minus
// internal-only fields like `ai_context`. It isn't in generated types yet,
// so we shape the public row off the underlying table type.
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type PublicProject = Omit<ProjectRow, "ai_context">;


export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects_public" as any)
        .select("*")
        .eq("status", "published")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as PublicProject[];
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects_public" as any)
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data as unknown as PublicProject | null;
    },
    enabled: !!slug,
  });
}
