-- Separate contact messages from quote requests and add a secure admin read path.
alter table public.inquiries
  alter column company drop not null,
  alter column country drop not null;

alter table public.inquiries
  add column if not exists inquiry_type text not null default 'quote'
    check (inquiry_type in ('contact', 'quote'));

create index if not exists inquiries_type_idx on public.inquiries (inquiry_type);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  display_name text
);

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;

drop policy if exists "Admins can verify their own access" on public.admin_users;
create policy "Admins can verify their own access"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

-- Replace the original insert-only grant with a policy that supports both forms.
grant insert on table public.inquiries to anon, authenticated;
grant select, update on table public.inquiries to authenticated;

drop policy if exists "Public visitors can submit inquiries" on public.inquiries;
create policy "Public visitors can submit inquiries"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (
    status = 'new'
    and inquiry_type in ('contact', 'quote')
  );

drop policy if exists "Admins can read inquiries" on public.inquiries;
create policy "Admins can read inquiries"
  on public.inquiries
  for select
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can update inquiry status" on public.inquiries;
create policy "Admins can update inquiry status"
  on public.inquiries
  for update
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

comment on column public.inquiries.inquiry_type is 'contact for a simple message, quote for a sourcing request.';
comment on table public.admin_users is 'Supabase Auth users allowed to view and manage DivineGrow enquiries.';

-- One-time admin setup after creating a user in Supabase Auth:
-- insert into public.admin_users (user_id, display_name)
-- select id, 'DivineGrow Admin' from auth.users where email = 'your-admin-email@example.com';
