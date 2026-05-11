DROP VIEW IF EXISTS public.projects_public;

CREATE VIEW public.projects_public
WITH (security_invoker = off) AS
SELECT
  id, title, title_en, slug, subtitle, subtitle_en,
  description, description_en, role, role_en,
  url, tech, status, published_at, sort_order,
  created_at, updated_at,
  problem_text, problem_text_en,
  solution_text, solution_text_en,
  result_text, result_text_en,
  presentation
FROM public.projects
WHERE status = 'published'
  AND (published_at IS NULL OR published_at <= now());

GRANT SELECT ON public.projects_public TO anon, authenticated;