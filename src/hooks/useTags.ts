import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tags").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useArchiveTags() {
  return useQuery({
    queryKey: ["archive_tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("archive_tags").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePostTags() {
  return useQuery({
    queryKey: ["post_tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("post_tags").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });
}
