-- =============================================
-- Supabase Migration: Create portfolio tables
-- Run this in the Supabase SQL Editor
-- =============================================

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_logo TEXT NOT NULL,
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Public read access policies (anyone can read)
CREATE POLICY "Allow public read access on projects"
  ON public.projects
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on experiences"
  ON public.experiences
  FOR SELECT
  USING (true);

-- Authenticated user policies for insert/update/delete
CREATE POLICY "Allow authenticated insert on projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on experiences"
  ON public.experiences
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on experiences"
  ON public.experiences
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on experiences"
  ON public.experiences
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
