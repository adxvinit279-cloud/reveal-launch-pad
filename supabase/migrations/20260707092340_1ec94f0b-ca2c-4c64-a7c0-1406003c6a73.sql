
-- Add 'removed' status
ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'removed';

-- Extend products with submission fields
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS featured_image text,
  ADD COLUMN IF NOT EXISTS gallery_images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS demo_video_url text,
  ADD COLUMN IF NOT EXISTS twitter_url text,
  ADD COLUMN IF NOT EXISTS linkedin_url text,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- Allow website_url to be validated only client-side; make submitted_by optional (already nullable)

-- Replace INSERT policy: allow anonymous submissions with strict guardrails
DROP POLICY IF EXISTS "authenticated submit product" ON public.products;
CREATE POLICY "anyone can submit product"
  ON public.products
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND submitted_by IS NULL
    AND upvote_count = 0
    AND is_featured = false
    AND is_trending = false
    AND is_editors_pick = false
  );

GRANT INSERT ON public.products TO anon;

-- Auto-grant admin role on signup for the designated admin email
CREATE OR REPLACE FUNCTION public.grant_admin_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'vinitshukla200@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_admin_on_signup();

-- Backfill if user already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'vinitshukla200@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Auto-set published_at when status flips to approved
CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_published_at ON public.products;
CREATE TRIGGER trg_set_published_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_published_at();
