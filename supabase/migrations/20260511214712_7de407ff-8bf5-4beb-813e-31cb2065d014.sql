UPDATE public.projects
SET solution_text = COALESCE(solution_text, description),
    solution_text_en = COALESCE(solution_text_en, description_en)
WHERE (description IS NOT NULL OR description_en IS NOT NULL)
  AND solution_text IS NULL
  AND solution_text_en IS NULL;