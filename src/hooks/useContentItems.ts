import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ContentType } from "@/lib/content-types";

export function useDashboardContentItems(filters?: { type?: ContentType; status?: string }) {
  return useQuery({
    queryKey: ["dashboard", "content-items", filters],
    queryFn: async () => {
      let q = supabase
        .from("content_items")
        .select("id, title, slug, type, status, project_id, updated_at, published_at, projects(title)");
      if (filters?.type) q = q.eq("type", filters.type);
      if (filters?.status) q = q.eq("status", filters.status);
      q = q.order("updated_at", { ascending: false });
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useContentItem(id: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "content-item", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function usePublishedContentByType(type: ContentType) {
  return useQuery({
    queryKey: ["content-items", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("id, title, slug, excerpt, cover_asset_id, published_at, project_id")
        .eq("type", type)
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function usePublishedContentByProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["content-items", "project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("id, title, slug, type, excerpt, published_at")
        .eq("project_id", projectId!)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!projectId,
  });
}

export function useContentItemBySlug(slug: string | undefined, type: ContentType) {
  return useQuery({
    queryKey: ["content-item", type, slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("slug", slug!)
        .eq("type", type)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug && !!type,
  });
}
