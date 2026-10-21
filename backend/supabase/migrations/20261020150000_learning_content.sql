-- Additive content library for drafts a parent can review.
-- This file does not drop tables, change parent accounts, or change progress rows.
-- It does not grant public writes. Run it once in the Supabase SQL editor.

begin;

create table if not exists public.learning_content (
  id text primary key check (id ~ '^[a-z0-9-]{1,80}$'),
  kind text not null check (kind in ('kalima', 'azkar', 'quiz', 'story', 'lesson', 'activity')),
  category text,
  title text not null check (char_length(title) between 1 and 160),
  arabic text,
  transliteration text,
  translation_en text,
  translation_ur text,
  body_en text,
  body_ur text,
  source text,
  review_status text not null default 'needs_review' check (review_status in ('draft', 'needs_review', 'verified')),
  verified boolean not null default false,
  age_min integer check (age_min is null or age_min between 3 and 10),
  age_max integer check (age_max is null or age_max between 3 and 10),
  difficulty text,
  repeat_count integer check (repeat_count is null or repeat_count between 1 and 1000),
  reward_points integer check (reward_points is null or reward_points between 0 and 100),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint learning_content_verified_matches_status check (
    (verified = true and review_status = 'verified')
    or (verified = false and review_status in ('draft', 'needs_review'))
  )
);

alter table public.learning_content enable row level security;
alter table public.learning_content force row level security;

drop policy if exists "read verified learning content" on public.learning_content;

create policy "read verified learning content"
  on public.learning_content
  for select
  to anon, authenticated
  using (verified = true and review_status = 'verified');

revoke all on table public.learning_content from anon, authenticated;
grant select on table public.learning_content to anon, authenticated;

commit;
