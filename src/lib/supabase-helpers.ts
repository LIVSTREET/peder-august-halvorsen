const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function getAssetUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
