-- Private catalog accessed only by the authenticated Next.js server.
create table if not exists public.catalog_store (
  id text primary key check (id = 'main'),
  revision bigint not null default 1 check (revision > 0),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);
alter table public.catalog_store enable row level security;
revoke all on public.catalog_store from public, anon, authenticated;
grant select, insert, update on public.catalog_store to service_role;
create policy "Server catalog access" on public.catalog_store
  for all to service_role using (true) with check (true);

-- A private bucket keeps unsaved and draft photos out of public storage URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog-photos', 'catalog-photos', false, 5242880, array['image/webp'])
on conflict (id) do nothing;
