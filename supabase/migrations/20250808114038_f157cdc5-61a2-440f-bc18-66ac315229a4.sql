-- Create enum for categories (idempotent)
DO $$ BEGIN
  CREATE TYPE public.question_category AS ENUM ('skills','preferences','readiness','motivation');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Timestamp update function (shared)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Questions table to store survey items and business weights
CREATE TABLE IF NOT EXISTS public.questions (
  id text PRIMARY KEY,
  text text NOT NULL,
  category public.question_category NOT NULL,
  business_weights jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and basic public read policy (safe for non-sensitive content)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read questions" ON public.questions;
CREATE POLICY "Public can read questions"
ON public.questions
FOR SELECT
USING (true);

-- Trigger to keep updated_at fresh
DROP TRIGGER IF EXISTS set_questions_updated_at ON public.questions;
CREATE TRIGGER set_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();