
-- Create the 'rooms' table
create table public.rooms (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  type text,
  "roomNumber" text,
  name text,
  pmt text,
  rate text,
  total text,
  "checkIn" text,
  "checkOut" text,
  "vehicleDesc" text,
  "backgroundColor" text,
  "textColor" text,
  location text,
  "roomType" text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security for rooms
alter table public.rooms enable row level security;

-- Set up RLS policy for rooms
create policy "Users can only access their own rooms"
  on public.rooms
  for all
  using (auth.uid() = user_id);

-- Create the 'footer_values' table
create table public.footer_values (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  showers text,
  bhd text,
  refunds text,
  motel text,
  returns text,
  airbnb text,
  cash text,
  card text,
  gt text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security for footer_values
alter table public.footer_values enable row level security;

-- Set up RLS policy for footer_values
create policy "Users can only access their own footer values"
  on public.footer_values
  for all
  using (auth.uid() = user_id);
