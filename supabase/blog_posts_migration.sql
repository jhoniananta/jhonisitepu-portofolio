-- =============================================
-- Supabase Migration: Create blog_posts table
-- Run this in the Supabase SQL Editor if the
-- portfolio tables already exist and you only
-- need the blog feature schema.
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  cover_image_url TEXT,
  content_html TEXT NOT NULL,
  content_text TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT FALSE,
  reading_time_minutes INTEGER DEFAULT 1,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx
  ON public.blog_posts (slug);

CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx
  ON public.blog_posts (published_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated insert on blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated update on blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated delete on blog_posts" ON public.blog_posts;

CREATE POLICY "Allow public read access on blog_posts"
  ON public.blog_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on blog_posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on blog_posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on blog_posts"
  ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON public.blog_posts;

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
