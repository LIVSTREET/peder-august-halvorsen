import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LeadStatus } from "@/lib/lead-status";

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

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, tags }: { id: string; status?: LeadStatus; tags?: string[] }) => {
      const payload: Record<string, unknown> = {};
      if (status !== undefined) payload.status = status;
      if (tags !== undefined) payload.tags = tags;

      const { data, error } = await supabase
        .from("brief_submissions")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dashboard", "leads"] });
      qc.invalidateQueries({ queryKey: ["dashboard", "lead"] });
    },
  });
}
