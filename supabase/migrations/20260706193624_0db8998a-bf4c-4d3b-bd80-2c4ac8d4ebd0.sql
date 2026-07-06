
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_upvote_count() FROM PUBLIC, anon, authenticated;

DROP POLICY "anyone subscribes" ON public.newsletter_subscribers;
CREATE POLICY "valid subscribe" ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) BETWEEN 5 AND 254);

DROP POLICY "anyone sends message" ON public.contact_messages;
CREATE POLICY "valid contact" ON public.contact_messages FOR INSERT
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(message) BETWEEN 10 AND 5000
    AND length(reason) BETWEEN 1 AND 100
  );
