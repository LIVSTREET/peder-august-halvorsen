ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS presentation text NOT NULL DEFAULT 'landscape';

COMMENT ON COLUMN public.projects.presentation IS 'Portfolio layout: landscape (desktop/wide browser frame) or portrait (mobile/app phone frame).';