-- Storage policies for product-images bucket
-- Public read access (images are displayed to all customers)
create policy "Public read product images"
    on storage.objects for select
    using (bucket_id = 'product-images');

-- Admin upload
create policy "Admins can upload product images"
    on storage.objects for insert
    with check (
        bucket_id = 'product-images'
        and public.is_admin()
    );

-- Admin update (upsert)
create policy "Admins can update product images"
    on storage.objects for update
    using (
        bucket_id = 'product-images'
        and public.is_admin()
    );

-- Admin delete
create policy "Admins can delete product images"
    on storage.objects for delete
    using (
        bucket_id = 'product-images'
        and public.is_admin()
    );
