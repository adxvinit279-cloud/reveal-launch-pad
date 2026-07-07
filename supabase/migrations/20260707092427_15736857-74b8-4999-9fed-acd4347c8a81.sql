
CREATE POLICY "public read product-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-media');

CREATE POLICY "anyone upload product-media"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'product-media');

CREATE POLICY "admins update product-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete product-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-media' AND public.has_role(auth.uid(), 'admin'));
