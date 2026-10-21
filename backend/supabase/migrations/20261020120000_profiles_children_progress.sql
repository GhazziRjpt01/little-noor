-- Little Noor parent, child, and progress tables.
-- This file does not apply itself. Run it once in the Supabase SQL editor.
-- It inserts no lesson text and no parent rows.
-- The SQL editor uses a privileged role, so a successful run does not prove Row Level Security.

begin;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now()
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  age integer not null check (age between 3 and 10),
  created_at timestamptz not null default now()
);

create index children_parent_id_idx on public.children (parent_id);

create table public.learning_progress (
  child_id uuid primary key references public.children (id) on delete cascade,
  lessons_completed integer not null default 0 check (lessons_completed between 0 and 10000),
  lessons_total integer not null default 0 check (lessons_total between 0 and 10000),
  kalimas_learned integer not null default 0 check (kalimas_learned between 0 and 10000),
  azkar_completed integer not null default 0 check (azkar_completed between 0 and 10000),
  quiz_correct integer not null default 0 check (quiz_correct between 0 and 10000),
  quiz_total integer not null default 0 check (quiz_total between 0 and 10000),
  streak integer not null default 0 check (streak between 0 and 10000),
  stars integer not null default 0 check (stars between 0 and 10000),
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id text primary key check (id ~ '^[a-z0-9-]{1,80}$'),
  title text not null check (char_length(title) between 1 and 120),
  verified boolean not null default false,
  audio_url text check (audio_url is null or audio_url like 'https://%'),
  reviewed_by text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.learning_progress enable row level security;
alter table public.lessons enable row level security;

alter table public.profiles force row level security;
alter table public.children force row level security;
alter table public.learning_progress force row level security;
alter table public.lessons force row level security;

create policy "parents read own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "parents insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "parents update own profile"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "parents read own children"
  on public.children
  for select
  to authenticated
  using (parent_id = auth.uid());

create policy "parents insert own children"
  on public.children
  for insert
  to authenticated
  with check (parent_id = auth.uid());

create policy "parents update own children"
  on public.children
  for update
  to authenticated
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

create policy "parents delete own children"
  on public.children
  for delete
  to authenticated
  using (parent_id = auth.uid());

create policy "parents read own progress"
  on public.learning_progress
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.children
      where children.id = learning_progress.child_id
        and children.parent_id = auth.uid()
    )
  );

create policy "parents insert own progress"
  on public.learning_progress
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.children
      where children.id = child_id
        and children.parent_id = auth.uid()
    )
  );

create policy "parents update own progress"
  on public.learning_progress
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.children
      where children.id = learning_progress.child_id
        and children.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.children
      where children.id = child_id
        and children.parent_id = auth.uid()
    )
  );

create policy "read verified lessons"
  on public.lessons
  for select
  to anon, authenticated
  using (verified = true);

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.children from anon, authenticated;
revoke all on table public.learning_progress from anon, authenticated;
revoke all on table public.lessons from anon, authenticated;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.children to authenticated;
grant select, insert, update on table public.learning_progress to authenticated;
grant select on table public.lessons to anon, authenticated;

create or replace function public.handle_new_parent()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), 'Parent')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_parent();

commit;
