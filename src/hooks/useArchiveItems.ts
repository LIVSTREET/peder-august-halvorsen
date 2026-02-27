import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useArchiveItems() {
  return useQuery({
    queryKey: ["archive_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("archive_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
