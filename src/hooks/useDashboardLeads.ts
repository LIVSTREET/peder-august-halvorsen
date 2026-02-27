import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardLeads() {
  return useQuery({
    queryKey: ["dashboard", "leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brief_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useDashboardLead(id: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "lead", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brief_submissions")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
