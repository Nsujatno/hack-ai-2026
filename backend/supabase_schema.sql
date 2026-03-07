-- Run this in the Supabase SQL Editor
-- (Drop & recreate if you already ran the old version)

drop table if exists public.onboarding_surveys;

create table public.onboarding_surveys (
  id                uuid primary key default gen_random_uuid(),
  -- No FK to auth.users — any UUID or null is accepted (hackathon demo)
  user_id           uuid,
  topic             text not null,
  skill_level       text not null,   -- complete_beginner | know_basics | intermediate | advanced
  learning_goal     text not null,   -- career | hobby | academics | curious
  instructor_tone   text not null,   -- fun_energetic | professional_direct | coach | relaxed
  daily_commitment  text not null,   -- 5_minutes | 10_15_minutes | 30_plus_minutes | own_pace
  created_at        timestamptz default now()
);

-- RLS: enabled, but service-role key bypasses it (used by our backend)
alter table public.onboarding_surveys enable row level security;

-- Allow inserts from the service role (backend) without restriction
create policy "Service role full access"
  on public.onboarding_surveys
  using (true)
  with check (true);

-- Optional: let authenticated users read their own rows via the anon key
create policy "Users can read their own survey"
  on public.onboarding_surveys for select
  using (auth.uid() = user_id or user_id is null);
