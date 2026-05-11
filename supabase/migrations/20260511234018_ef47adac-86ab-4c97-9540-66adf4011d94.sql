REVOKE SELECT (ai_context) ON public.projects FROM anon;
REVOKE SELECT (ai_context) ON public.projects FROM authenticated;
GRANT SELECT (ai_context) ON public.projects TO authenticated;