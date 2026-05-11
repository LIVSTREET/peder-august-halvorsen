ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS ai_context text;
COMMENT ON COLUMN public.projects.ai_context IS 'Internal notes / raw facts used as AI context. Never shown publicly.';