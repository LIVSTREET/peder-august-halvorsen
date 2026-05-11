import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Explicit column list — never expose `ai_context` (internal admin notes).
const PUBLIC_PROJECT_COLUMNS =
  "id,title,title_en,slug,subtitle,subtitle_en,description,description_en,role,role_en,url,tech,status,published_at,sort_order,created_at,updated_at,problem_text,problem_text_en,solution_text,solution_text_en,result_text,result_text_en,presentation";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(PUBLIC_PROJECT_COLUMNS)
        .eq("status", "published")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(PUBLIC_PROJECT_COLUMNS)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}
