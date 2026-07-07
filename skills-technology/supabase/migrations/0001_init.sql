-- ============================================================================
-- Skills Technology — initial schema, roles, RLS, storage, seed data
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Role enum + user_roles table (roles are NEVER stored on profiles)
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  primary key (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security-definer function: safe to call from RLS policies without
-- recursive-policy issues, and safe to call from the client via rpc().
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create policy "users can read their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "admins manage roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- 2. Profiles (1:1 with auth.users, created on signup via trigger)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text
);

alter table public.profiles enable row level security;

create policy "profiles are readable by everyone"
  on public.profiles for select
  using (true);

create policy "users manage their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 3. Categories
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

alter table public.categories enable row level security;

create policy "categories are publicly readable"
  on public.categories for select
  using (true);

create policy "admins manage categories"
  on public.categories for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "admins update categories"
  on public.categories for update
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "admins delete categories"
  on public.categories for delete
  using (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- 4. Courses
-- ---------------------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references public.categories (id) on delete set null,
  description text not null default '',
  image_url text,
  price numeric(10, 2) not null default 0,
  discounted_price numeric(10, 2),
  is_premium boolean not null default false,
  is_vip boolean not null default false,
  rating numeric(2, 1) not null default 5.0,
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "courses are publicly readable"
  on public.courses for select
  using (true);

create policy "admins manage courses"
  on public.courses for insert
  with check (public.has_role(auth.uid(), 'admin'));

create policy "admins update courses"
  on public.courses for update
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "admins delete courses"
  on public.courses for delete
  using (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- 5. Contact messages
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);

create policy "admins read contact messages"
  on public.contact_messages for select
  using (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- 6. Storage bucket for course thumbnails
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('course-images', 'course-images', true)
on conflict (id) do nothing;

create policy "course images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'course-images');

create policy "admins upload course images"
  on storage.objects for insert
  with check (
    bucket_id = 'course-images'
    and public.has_role(auth.uid(), 'admin')
  );

create policy "admins update course images"
  on storage.objects for update
  using (
    bucket_id = 'course-images'
    and public.has_role(auth.uid(), 'admin')
  );

create policy "admins delete course images"
  on storage.objects for delete
  using (
    bucket_id = 'course-images'
    and public.has_role(auth.uid(), 'admin')
  );

-- ---------------------------------------------------------------------------
-- 7. Seed categories + sample courses (matching the source site)
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug) values
  ('Free 3D Animation', 'free-3d-animation'),
  ('TikTok Automation', 'tiktok-automation'),
  ('VIP Courses', 'vip-courses')
on conflict (slug) do nothing;

insert into public.courses
  (title, slug, category_id, description, image_url, price, discounted_price, is_premium, is_vip, rating)
select
  '3D Animation Reels',
  '3d-animation-reels',
  (select id from public.categories where slug = 'free-3d-animation'),
  'Learn to produce eye-catching 3D animated reels from scratch — modeling, rigging, motion, and export workflows for short-form video.',
  null,
  0,
  null,
  false,
  false,
  5.0
where not exists (select 1 from public.courses where slug = '3d-animation-reels');

insert into public.courses
  (title, slug, category_id, description, image_url, price, discounted_price, is_premium, is_vip, rating)
select
  'TikTok Automation',
  'tiktok-automation',
  (select id from public.categories where slug = 'tiktok-automation'),
  'Build automated content pipelines for TikTok: sourcing, editing, scheduling, and scaling an account with minimal manual work.',
  null,
  49.00,
  29.00,
  true,
  false,
  4.8
where not exists (select 1 from public.courses where slug = 'tiktok-automation');

-- ---------------------------------------------------------------------------
-- 8. Promote the first signed-up user to admin (seed only — remove or
--    adjust after your first real admin account exists)
-- ---------------------------------------------------------------------------
-- insert into public.user_roles (user_id, role)
-- select id, 'admin' from auth.users order by created_at asc limit 1
-- on conflict do nothing;
