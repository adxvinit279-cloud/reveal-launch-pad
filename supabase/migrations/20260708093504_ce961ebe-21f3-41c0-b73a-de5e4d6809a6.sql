-- Fix: allow anon (public visitors) to execute has_role so multi-policy SELECTs
-- on products/blog_posts don't fail with 42501.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;

-- Ensure default grants for public reads on the three public-facing tables
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.categories TO anon;

-- Add created_at to blog_posts if missing (needed for admin sorting on drafts)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blog_posts' AND column_name='created_at') THEN
    ALTER TABLE public.blog_posts ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;