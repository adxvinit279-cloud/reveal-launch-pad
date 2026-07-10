
CREATE OR REPLACE FUNCTION public.slugify(input text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT trim(both '-' from regexp_replace(regexp_replace(lower(coalesce(input,'')), '[^a-z0-9]+', '-', 'g'), '-+', '-', 'g'));
$$;

CREATE OR REPLACE FUNCTION public.blog_posts_ensure_slug()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  base text;
  candidate text;
  n int := 1;
BEGIN
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 OR NEW.slug ~ '[^a-z0-9-]' THEN
    base := public.slugify(coalesce(NEW.slug, NEW.title));
    IF base IS NULL OR base = '' THEN
      base := 'post-' || substr(gen_random_uuid()::text, 1, 8);
    END IF;
    candidate := base;
    WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = candidate AND id <> NEW.id) LOOP
      n := n + 1;
      candidate := base || '-' || n;
    END LOOP;
    NEW.slug := candidate;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS blog_posts_ensure_slug_trg ON public.blog_posts;
CREATE TRIGGER blog_posts_ensure_slug_trg
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.blog_posts_ensure_slug();

-- Fix existing bad slugs
UPDATE public.blog_posts SET slug = slug WHERE slug ~ '[^a-z0-9-]' OR slug IS NULL OR slug = '';
