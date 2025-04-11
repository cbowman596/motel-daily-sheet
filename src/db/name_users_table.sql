
-- Create the 'name_users' table
create table public.name_users (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security for name_users
alter table public.name_users enable row level security;

-- Set up RLS policy for name_users
create policy "Anyone can view name_users"
  on public.name_users
  for select
  to authenticated
  using (true);

create policy "Authentication service can insert name_users"
  on public.name_users
  for insert
  to authenticated
  with check (true);
