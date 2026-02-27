-- Create public-assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "public_assets_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-assets');

-- Owner write (insert, update, delete)
CREATE POLICY "public_assets_owner_write"
ON storage.objects FOR ALL
USING (
  bucket_id = 'public-assets'
  AND auth.uid() = (SELECT owner_user_id FROM public.app_settings LIMIT 1)
)
WITH CHECK (
  bucket_id = 'public-assets'
  AND auth.uid() = (SELECT owner_user_id FROM public.app_settings LIMIT 1)
);