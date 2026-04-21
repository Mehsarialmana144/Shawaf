# Shawaf — شواف

AI-powered travel planner for Saudi Arabia.

## Setup

1. Clone and install:
```bash
npm install
```

2. Copy env and fill your Supabase credentials:
```bash
cp .env.example .env
```

3. Run dev server:
```bash
npm run dev
```


## Supabase Setup

### Database Tables

```sql
-- profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- trips
create table trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city text not null,
  budget text,
  days integer,
  travel_with text,
  interests text[],
  trip_style text,
  has_car boolean default false,
  preferred_time text,
  notes text,
  ai_plan jsonb,
  created_at timestamptz default now()
);
alter table trips enable row level security;
create policy "Users can view own trips" on trips for select using (auth.uid() = user_id);
create policy "Users can insert own trips" on trips for insert with check (auth.uid() = user_id);
create policy "Users can delete own trips" on trips for delete using (auth.uid() = user_id);
```

### Edge Function

Deploy the `generate-trip` edge function:
```bash
supabase functions deploy generate-trip
```

Set your AI API key as a secret:
```bash
supabase secrets set OPENAI_API_KEY=your_key_here
```

## Tech Stack

- React + Vite
- Tailwind CSS
- Supabase (Auth + Database + Edge Functions)
- React Router
- Leaflet / OpenStreetMap
- jsPDF
- Recharts
