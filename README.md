# Shawaf — شواف

Shawaf is an AI-powered travel planner for Saudi Arabia. It helps users generate personalized day-by-day itineraries based on selected city/cities, trip dates, budget, interests, activity level, number of travelers, and additional notes.

The project is built as a React/Vite web application with Supabase authentication, database storage, Supabase Edge Functions, OpenAI itinerary generation, Leaflet/OpenStreetMap map visualization, Google Maps external links, and PDF export.

## Live Website

Production domain:

```text
https://shawaf-gp.com
```

## Main Features

- User sign up, sign in, sign out, and reset password through Supabase Auth.
- Bilingual interface: English and Arabic.
- Responsive design for mobile, tablet, and desktop.
- Shawaf brand identity using Saudi green, fine gold, off-white, and charcoal.
- Multi-city trip planning through a dropdown city selector.
- AI-generated itinerary based on user preferences.
- Arabic itinerary generation when the website language is Arabic.
- Long-trip generation support through Edge Function batching.
- Saved trips in the user profile.
- PDF export with Arabic font support.
- Interactive map using Leaflet/OpenStreetMap.
- Google Maps external links for each activity.
- Estimated map markers when the AI plan does not include exact coordinates.
- Report Issue page for users and guests.
- Admin dashboard separated from the normal user experience.
- Admin pages for dashboard overview, attraction management, report management, and analytics.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Supabase Auth
- Supabase Database
- Supabase Edge Functions
- OpenAI API
- Leaflet / OpenStreetMap
- Google Maps external links
- jsPDF
- Recharts
- Vercel

## Project Structure

```text
Shawaf/
├── index.html
├── package.json
├── vercel.json
├── public/
│   ├── favicon.png
│   ├── brand/
│   │   └── shawaf-logo.png
│   └── fonts/
│       └── NotoNaskhArabic-Regular.ttf
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── planner/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── supabase/
    └── functions/
        └── generate-trip/
            └── index.ts
```

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env` in the project root and add Supabase variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Vercel Routing Fix

Because Shawaf uses React Router, refreshing pages such as `/planner`, `/profile`, or `/admin` on Vercel needs a rewrite rule.

Create `vercel.json` in the project root, next to `package.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Do not place `vercel.json` inside `src`.

## Supabase Setup

### Required Authentication Settings

In Supabase Authentication URL Configuration:

Site URL:

```text
https://shawaf-gp.com
```

Redirect URLs:

```text
https://shawaf-gp.com/**
http://localhost:5173/**
```

These redirects are required for reset password and auth flows.

## Database Tables

### profiles

Stores user profile information and role.

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on profiles for insert
with check (auth.uid() = id);
```

### trips

Stores saved user trips. The itinerary is stored in `ai_plan` as JSONB.

```sql
create table if not exists trips (
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

create policy "Users can view own trips"
on trips for select
using (auth.uid() = user_id);

create policy "Users can insert own trips"
on trips for insert
with check (auth.uid() = user_id);

create policy "Users can delete own trips"
on trips for delete
using (auth.uid() = user_id);
```

### attractions

Stores curated tourism attractions for admin management and future database-grounded itinerary generation.

```sql
create table if not exists attractions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  city text not null,
  category text not null,
  description text,
  description_ar text,
  opening_time time,
  closing_time time,
  estimated_duration integer,
  latitude numeric,
  longitude numeric,
  price_range text,
  availability_type text default 'permanent' check (availability_type in ('permanent', 'seasonal')),
  source_url text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table attractions enable row level security;
```

### user_reports

Stores issue reports submitted by users or guests.

```sql
create table if not exists user_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  trip_id uuid references trips(id) on delete set null,
  report_type text default 'technical',
  message text not null,
  status text default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_reports enable row level security;
```

## Edge Function

The itinerary generator is located at:

```text
supabase/functions/generate-trip/index.ts
```

The frontend may call the function using the deployed name `Generate-trip` or `generate-trip`, depending on the Supabase function name used in the project.

Deploy using the matching function name:

```bash
supabase functions deploy Generate-trip
```

or:

```bash
supabase functions deploy generate-trip
```

Set the OpenAI API key as a Supabase secret:

```bash
supabase secrets set OPENAI_API_KEY=your_key_here
```

### Edge Function Behavior

The function receives trip data from `StepTwo.jsx`, including:

- `city`
- `cities`
- `budget`
- `days`
- `travelWith`
- `interests`
- `tripStyle`
- `hasCar`
- `preferredTime`
- `notes`
- `numberOfPeople`
- `accommodation`
- `tripType`
- `lang`

For long trips, the function generates the itinerary in batches of 3 days to avoid incomplete JSON responses from the AI model.

If `lang` is `ar`, the itinerary should return Arabic place names and Arabic descriptions when possible. Category values remain in English because the system uses them internally.

Expected final response shape:

```json
{
  "city": "Riyadh",
  "cities": ["Riyadh", "Jeddah"],
  "language": "en",
  "days": [],
  "itinerary": []
}
```

## Frontend Notes

### Multi-city Planning

`StepOne.jsx` uses a dropdown city selector. Each selected city is added as a chip under the dropdown. The trip data should include:

```js
city: ''
cities: []
```

`city` stores the first selected city, while `cities` stores the full selected route.

### Generate Itinerary

`StepTwo.jsx` sends the selected cities and current language to the Edge Function. Saving should not happen automatically during generation. The itinerary is saved only when the user clicks Save Trip in `StepThree.jsx`.

### Saved Trips

Saved trips are stored in the `trips` table with the full AI plan in `ai_plan`.

### Map Page

`MapPage.jsx` uses real coordinates if available. If the AI plan does not include coordinates, the page shows estimated markers around the selected city center so the map still visualizes the trip.

Google Maps links use real coordinates when available. Otherwise, they search by place name and city.

### PDF Export

PDF export uses:

```text
public/fonts/NotoNaskhArabic-Regular.ttf
```

The current PDF export uses Shawaf brand colors and supports Arabic text through the Noto Naskh Arabic font.

## Branding

Main brand colors:

```text
Saudi Green: #006A4E
Dark Green:  #004D39
Fine Gold:   #D4AF37
Off White:   #F5F5F0
Charcoal:    #333333
```

Logo files:

```text
public/brand/shawaf-logo.png
public/favicon.png
```

`index.html` should use:

```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

## Deployment Workflow

Before pushing changes:

```bash
npm run build
git status
```

Stage, commit, and push:

```bash
git add .
git commit -m "Update Shawaf project"
git push
```

Deploy Edge Function when `supabase/functions/generate-trip/index.ts` changes:

```bash
supabase functions deploy Generate-trip
```

or:

```bash
supabase functions deploy generate-trip
```

Vercel redeploys the frontend automatically after `git push`.

## Important Troubleshooting

### Refreshing a page on Vercel shows 404

Make sure `vercel.json` is in the project root and contains the rewrite to `/index.html`.

### Long itinerary generation fails with JSON parse error

Use batch generation in the Edge Function. Do not request all 10+ days from the model in a single response.

### Map markers do not appear

The AI may not return coordinates. Use fallback estimated markers or store accurate attraction coordinates in the `attractions` table.

### Arabic PDF text does not render correctly

Make sure this font exists:

```text
public/fonts/NotoNaskhArabic-Regular.ttf
```

### Logo or favicon does not appear

Make sure these files exist:

```text
public/brand/shawaf-logo.png
public/favicon.png
```

Then rebuild and redeploy.

## Current Project Status

Completed or implemented:

- React/Vite frontend.
- Supabase Auth.
- AI itinerary generation.
- Multi-city dropdown selection.
- Long itinerary batching in Edge Function.
- Arabic and English UI.
- Arabic itinerary output when language is Arabic.
- Saved trips.
- Profile page.
- Map page with markers and Google Maps links.
- PDF export.
- Reset password flow.
- Report Issue feature.
- Admin dashboard and admin-only routes.
- Admin attractions page.
- Admin reports page.
- Admin analytics page.
- Shawaf branding and logo.
- Vercel deployment rewrite.

Recommended future improvement:

- Store verified coordinates and source URLs for all attractions in the database.
- Use the attractions table as the main source for AI itinerary generation.
- Improve itinerary optimization using opening hours, duration, and distances.
