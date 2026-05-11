-- Public-facing view of projects, excluding internal admin-only fields.
CREATE OR REPLACE VIEW public.projects_public
WITH (security_invoker = on) AS
SELECT
  id, title, title_en, slug, subtitle, subtitle_en,
  description, description_en, role, role_en,
  url, tech, status, published_at, sort_order,
  created_at, updated_at,
  problem_text, problem_text_en,
  solution_text, solution_text_en,
  result_text, result_text_en,
  presentation
FROM public.projects;

-- View needs to be readable by both anon and authenticated.
GRANT SELECT ON public.projects_public TO anon, authenticated;

-- Remove anon's direct SELECT on the underlying table so ai_context cannot leak.
-- Authenticated keeps full table access (RLS still enforces is_owner for writes).
REVOKE SELECT ON public.projects FROM anon;