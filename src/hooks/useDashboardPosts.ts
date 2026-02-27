import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

export function useDashboardPosts() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["dashboard", "posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  const setStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      publishedAt,
    }: {
      id: string;
      status: "draft" | "published" | "archived";
      publishedAt: string | null;
    }) => {
      const payload: PostUpdate = {
        status,
        ...(status === "published" && !publishedAt
          ? { published_at: new Date().toISOString() }
          : {}),
      };
      const { data, error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard", "posts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    ...query,
    setStatus: setStatusMutation.mutateAsync,
  };
}
