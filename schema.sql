-- अक्षरपाठ database. Paste this whole file into Supabase: SQL Editor > New query > Run.

create extension if not exists pgcrypto;

-- People: every signed-in user gets a profile. role = 'author' (default) or 'editor'.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'author' check (role in ('author','editor')),
  created_at timestamptz not null default now()
);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create function public.is_editor() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'editor');
$$;

-- Issues: one row per monthly ank.
create table public.issues (
  id uuid primary key default gen_random_uuid(),
  vol int not null check (vol > 0),
  ank int not null check (ank > 0),
  month int not null check (month between 1 and 12),
  year int not null check (year > 2000),
  theme text not null check (char_length(theme) between 1 and 200),
  note text check (char_length(note) <= 500),
  is_live boolean not null default false,
  created_at timestamptz not null default now(),
  unique (vol, ank)
);

-- Submissions / articles.
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique default ('AP-' || upper(substr(md5(random()::text), 1, 6))),
  author_id uuid not null references auth.users(id) on delete cascade,
  issue_id uuid references public.issues(id) on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  city text check (char_length(city) <= 120),
  contact text not null check (char_length(contact) between 1 and 200),
  kind text not null check (char_length(kind) between 1 and 40),
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) between 1 and 1000000),
  plan int not null check (plan in (20, 50, 100)),
  utr text not null check (utr ~ '^[0-9]{12}$'),
  status text not null default 'review' check (status in ('review', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Authors can never change payment details, reference number, or owner after submitting.
create function public.articles_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if not public.is_editor() then
    new.ref := old.ref;
    new.plan := old.plan;
    new.utr := old.utr;
    new.author_id := old.author_id;
  end if;
  return new;
end $$;

create trigger articles_guard_trg
before update on public.articles
for each row execute function public.articles_guard();

alter table public.profiles enable row level security;
alter table public.issues   enable row level security;
alter table public.articles enable row level security;

-- profiles: you can read your own row; editors can read all. Roles change only through SQL.
create policy profiles_read on public.profiles for select
  using (id = auth.uid() or public.is_editor());

-- issues: everyone can read live issues; editors can do everything.
create policy issues_public_read on public.issues for select
  using (is_live or public.is_editor());
create policy issues_editor_write on public.issues for all
  using (public.is_editor()) with check (public.is_editor());

-- articles
create policy articles_author_read on public.articles for select
  using (author_id = auth.uid() or public.is_editor());

create policy articles_author_insert on public.articles for insert to authenticated
  with check (author_id = auth.uid() and status = 'review' and issue_id is null and published_at is null);

-- Authors may edit only while status = 'review'. Once an editor publishes, this policy stops matching.
create policy articles_author_update on public.articles for update to authenticated
  using (author_id = auth.uid() and status = 'review')
  with check (author_id = auth.uid() and status = 'review' and issue_id is null and published_at is null);

create policy articles_editor_all on public.articles for all
  using (public.is_editor()) with check (public.is_editor());

-- Public reading: only the safe columns of published articles in live issues (no contact or payment details).
create view public.public_articles as
  select a.id, a.issue_id, a.title, a.body, a.name, a.city, a.kind, a.published_at
  from public.articles a
  join public.issues i on i.id = a.issue_id
  where a.status = 'published' and i.is_live;

grant select on public.public_articles to anon, authenticated;

-- After you sign in once on the site, make yourself the editor (replace the email):
-- update public.profiles set role = 'editor'
--   where id = (select id from auth.users where email = 'you@example.com');
