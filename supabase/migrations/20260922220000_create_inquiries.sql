create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  name text not null check (char_length(name) between 1 and 160),
  company text not null check (char_length(company) between 1 and 200),
  country text not null check (char_length(country) between 1 and 120),
  business_type text check (business_type is null or char_length(business_type) <= 120),
  email text not null check (char_length(email) between 3 and 320),
  phone text check (phone is null or char_length(phone) <= 80),
  product text check (product is null or char_length(product) <= 120),
  quantity text check (quantity is null or char_length(quantity) <= 120),
  message text check (message is null or char_length(message) <= 4000),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed'))
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

alter table public.inquiries enable row level security;

revoke all on table public.inquiries from anon, authenticated;
grant insert on table public.inquiries to anon, authenticated;

drop policy if exists "Public visitors can submit inquiries" on public.inquiries;
create policy "Public visitors can submit inquiries"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (status = 'new');

comment on table public.inquiries is 'Quote and sourcing enquiries submitted from the DivineGrow LLP website.';

-- Deliberately no public SELECT policy: visitors can submit enquiries but cannot read buyer data.

alter table public.inquiries add column if not exists consented_at timestamptz;

-- Keep future schema changes additive and safe for repeat deployments.
update public.inquiries
set consented_at = created_at
where consented_at is null;
