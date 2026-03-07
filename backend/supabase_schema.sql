-- Run this in the Supabase SQL Editor

create table if not exists public.onboarding_surveys (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete set null,
  topic             text not null,
  skill_level       text not null,   -- complete_beginner | know_basics | intermediate | advanced
  learning_goal     text not null,   -- career | hobby | academics | curious
  instructor_tone   text not null,   -- fun_energetic | professional_direct | coach | relaxed
  daily_commitment  text not null,   -- 5_minutes | 10_15_minutes | 30_plus_minutes | own_pace
  created_at        timestamptz default now()
);

-- Allow any authenticated user to insert their own survey row
alter table public.onboarding_surveys enable row level security;

create policy "Users can insert their own survey"
  on public.onboarding_surveys for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can read their own survey"
  on public.onboarding_surveys for select
  using (auth.uid() = user_id or user_id is null);
