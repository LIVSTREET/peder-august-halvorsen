
-- Add status, tags, updated_at to brief_submissions
ALTER TABLE public.brief_submissions
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Validation trigger instead of CHECK constraint
CREATE OR REPLACE FUNCTION public.validate_brief_status()
RETURNS trigger AS $$
BEGIN
  IF NEW.status NOT IN ('new', 'contacted', 'warm', 'won', 'lost') THEN
    RAISE EXCEPTION 'Invalid brief status: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS brief_submissions_validate_status ON public.brief_submissions;
CREATE TRIGGER brief_submissions_validate_status
  BEFORE INSERT OR UPDATE ON public.brief_submissions
  FOR EACH ROW EXECUTE FUNCTION public.validate_brief_status();

-- updated_at trigger (reuse existing function)
DROP TRIGGER IF EXISTS brief_submissions_updated_at ON public.brief_submissions;
CREATE TRIGGER brief_submissions_updated_at
  BEFORE UPDATE ON public.brief_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
