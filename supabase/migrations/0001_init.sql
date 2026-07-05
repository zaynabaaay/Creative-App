-- ============================================================
-- Creative Hub — initial schema
-- Paste this whole file into Supabase → SQL Editor → Run.
-- ============================================================

-- ---------- profiles ----------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  handle       text not null check (handle ~ '^[a-z0-9._]{3,30}$'),
  role_title   text not null default '' check (char_length(role_title) <= 120),
  bio          text not null default '' check (char_length(bio) <= 600),
  area         text not null default '' check (char_length(area) <= 80),
  rate         text not null default '' check (char_length(rate) <= 60),
  disciplines  text[] not null default '{}',
  avatar_url   text,
  is_available boolean not null default true,
  created_at   timestamptz not null default now()
);
create unique index profiles_handle_key on public.profiles (lower(handle));

-- ---------- portfolio_items ----------
create table public.portfolio_items (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  image_url  text not null,
  caption    text not null default '' check (char_length(caption) <= 200),
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);
create index portfolio_items_profile_idx on public.portfolio_items (profile_id, sort_order);

-- ---------- jobs ----------
create table public.jobs (
  id          uuid primary key default gen_random_uuid(),
  poster_id   uuid not null references public.profiles (id) on delete cascade,
  title       text not null check (char_length(title) between 3 and 120),
  brief       text not null default '' check (char_length(brief) <= 2000),
  area        text not null check (char_length(area) between 1 and 80),
  budget      text check (char_length(budget) <= 60),          -- optional, freeform ("$150 flat")
  date        date,                                            -- optional shoot date
  poster_kind text not null default 'client' check (poster_kind in ('creative', 'client')),
  roles       text[] not null check (cardinality(roles) >= 1), -- usually exactly one
  disciplines text[] not null default '{}',                    -- for feed filtering
  status      text not null default 'open' check (status in ('open', 'closed')),
  created_at  timestamptz not null default now()
);
create index jobs_feed_idx on public.jobs (status, created_at desc);

-- ---------- responses ----------
create table public.responses (
  id           uuid primary key default gen_random_uuid(),
  job_id       uuid not null references public.jobs (id) on delete cascade,
  responder_id uuid not null references public.profiles (id) on delete cascade,
  note         text not null default '' check (char_length(note) <= 500),
  created_at   timestamptz not null default now(),
  unique (job_id, responder_id)                 -- no double-responding
);
create index responses_job_idx on public.responses (job_id, created_at);

-- ---------- conversations ----------
-- participant_a < participant_b is enforced so one pair can never
-- accidentally get two conversations.
create table public.conversations (
  id            uuid primary key default gen_random_uuid(),
  participant_a uuid not null references public.profiles (id) on delete cascade,
  participant_b uuid not null references public.profiles (id) on delete cascade,
  job_id        uuid references public.jobs (id) on delete set null,
  created_at    timestamptz not null default now(),
  check (participant_a < participant_b),
  unique (participant_a, participant_b)
);

-- ---------- messages ----------
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id) on delete cascade,
  body            text not null check (char_length(body) between 1 and 2000),
  created_at      timestamptz not null default now()
);
create index messages_conversation_idx on public.messages (conversation_id, created_at);

-- ---------- vouches (displayed in v1; write-flow is phase 2) ----------
create table public.vouches (
  id         uuid primary key default gen_random_uuid(),
  from_id    uuid not null references public.profiles (id) on delete cascade,
  to_id      uuid not null references public.profiles (id) on delete cascade,
  job_id     uuid references public.jobs (id) on delete set null,
  created_at timestamptz not null default now(),
  check (from_id <> to_id),
  unique (from_id, to_id, job_id)
);

-- ---------- collaborations (schema only in v1; phase-2 growth loop) ----------
create table public.collaborations (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid references public.jobs (id) on delete set null,
  profile_a   uuid not null references public.profiles (id) on delete cascade,
  profile_b   uuid not null references public.profiles (id) on delete cascade,
  confirmed_a boolean not null default false,
  confirmed_b boolean not null default false,
  created_at  timestamptz not null default now(),
  check (profile_a < profile_b),
  unique (profile_a, profile_b, job_id)
);

-- ---------- trust-graph counts ----------
-- One row per profile: confirmed collab count + vouch count.
create view public.profile_stats
with (security_invoker = true) as
select
  p.id as profile_id,
  (
    select count(*) from public.collaborations c
    where (c.profile_a = p.id or c.profile_b = p.id)
      and c.confirmed_a and c.confirmed_b
  ) as collabs_count,
  (select count(*) from public.vouches v where v.to_id = p.id) as vouches_count
from public.profiles p;

-- ============================================================
-- Row-level security: everyone can look, only you can touch
-- your own rows. (Deny-by-default once RLS is enabled.)
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.jobs            enable row level security;
alter table public.responses       enable row level security;
alter table public.conversations   enable row level security;
alter table public.messages        enable row level security;
alter table public.vouches         enable row level security;
alter table public.collaborations  enable row level security;

-- profiles: public directory
create policy "profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- portfolio_items: public gallery, owner-managed
create policy "portfolio items are viewable by everyone"
  on public.portfolio_items for select using (true);
create policy "owners manage their portfolio items"
  on public.portfolio_items for insert with check (auth.uid() = profile_id);
create policy "owners update their portfolio items"
  on public.portfolio_items for update using (auth.uid() = profile_id);
create policy "owners delete their portfolio items"
  on public.portfolio_items for delete using (auth.uid() = profile_id);

-- jobs: public board, poster-managed
create policy "jobs are viewable by everyone"
  on public.jobs for select using (true);
create policy "signed-in users can post jobs as themselves"
  on public.jobs for insert with check (auth.uid() = poster_id);
create policy "posters update their own jobs"
  on public.jobs for update using (auth.uid() = poster_id);
create policy "posters delete their own jobs"
  on public.jobs for delete using (auth.uid() = poster_id);

-- responses: visible to signed-in users (responder lists are part of the
-- product), created/withdrawn only by the responder
create policy "responses are viewable by signed-in users"
  on public.responses for select using (auth.role() = 'authenticated');
create policy "users respond as themselves"
  on public.responses for insert with check (auth.uid() = responder_id);
create policy "users withdraw their own responses"
  on public.responses for delete using (auth.uid() = responder_id);

-- conversations: participants only
create policy "participants can view their conversations"
  on public.conversations for select
  using (auth.uid() in (participant_a, participant_b));
create policy "users can start conversations they belong to"
  on public.conversations for insert
  with check (auth.uid() in (participant_a, participant_b));

-- messages: participants only
create policy "participants can read messages"
  on public.messages for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and auth.uid() in (c.participant_a, c.participant_b)
    )
  );
create policy "participants can send messages as themselves"
  on public.messages for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and auth.uid() in (c.participant_a, c.participant_b)
    )
  );

-- vouches / collaborations: readable by all; no client writes in v1
create policy "vouches are viewable by everyone"
  on public.vouches for select using (true);
create policy "collaborations are viewable by everyone"
  on public.collaborations for select using (true);

-- ============================================================
-- Realtime: let chat messages stream to participants
-- ============================================================
alter publication supabase_realtime add table public.messages;

-- ============================================================
-- Storage: public-read buckets for avatars + portfolio images;
-- each user writes only inside their own <uid>/ folder.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',   'avatars',   true, 5242880,  array['image/jpeg','image/png','image/webp']),
  ('portfolio', 'portfolio', true, 10485760, array['image/jpeg','image/png','image/webp']);

create policy "public read of images"
  on storage.objects for select
  using (bucket_id in ('avatars', 'portfolio'));
create policy "users upload to their own folder"
  on storage.objects for insert
  with check (
    bucket_id in ('avatars', 'portfolio')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "users update files in their own folder"
  on storage.objects for update
  using (
    bucket_id in ('avatars', 'portfolio')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "users delete files in their own folder"
  on storage.objects for delete
  using (
    bucket_id in ('avatars', 'portfolio')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
