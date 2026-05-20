-- Shawaf database schema reference.
-- This file documents the columns the app currently reads and writes.
-- Review before running in Supabase, especially if tables already exist.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city text not null,
  budget text,
  days int4,
  travel_with text,
  interests text[],
  trip_style text,
  notes text,
  ai_plan jsonb,
  created_at timestamptz default now()
);

create table if not exists public.attractions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  city text not null,
  category text not null,
  description text,
  description_ar text,
  opening_time time,
  closing_time time,
  estimated_duration int4,
  latitude float8,
  longitude float8,
  price_range text,
  availability_type text default 'permanent',
  status text default 'active',
  verification_note text,
  source_used text,
  source_url text,
  batch_number text,
  review_status text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

create table if not exists public.user_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  trip_id uuid references public.trips(id) on delete set null,
  report_type text not null,
  message text not null,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz
);

