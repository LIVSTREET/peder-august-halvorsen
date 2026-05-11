ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS problem_text text,
  ADD COLUMN IF NOT EXISTS solution_text text,
  ADD COLUMN IF NOT EXISTS result_text text,
  ADD COLUMN IF NOT EXISTS problem_text_en text,
  ADD COLUMN IF NOT EXISTS solution_text_en text,
  ADD COLUMN IF NOT EXISTS result_text_en text;