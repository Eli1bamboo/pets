create table if not exists public.business_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.business_settings enable row level security;

do $$
begin
    if not exists (
        select 1 from pg_policies where tablename = 'business_settings' and policyname = 'Allow public read access'
    ) then
        create policy "Allow public read access" on public.business_settings
            for select using (true);
    end if;

    if not exists (
        select 1 from pg_policies where tablename = 'business_settings' and policyname = 'Admins can all business settings'
    ) then
        create policy "Admins can all business settings" on public.business_settings
            for all using (public.is_admin());
    end if;
end $$;

-- Insert default cancellation window (2 hours)
insert into public.business_settings (key, value)
values ('cancellation_window_hours', '2')
on conflict (key) do nothing;
