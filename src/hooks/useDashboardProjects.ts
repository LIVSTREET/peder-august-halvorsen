import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export function useDashboardProjects() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["dashboard", "projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ProjectUpdate }) => {
      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const setStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "draft" | "published" | "archived";
    }) => {
      const payload: ProjectUpdate = {
        status,
        ...(status === "published" ? { published_at: new Date().toISOString() } : {}),
      };
      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard", "projects"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    ...query,
    updateProject: updateMutation.mutateAsync,
    setStatus: setStatusMutation.mutateAsync,
  };
}
