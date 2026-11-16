-- MTG General Store and Logistics: database setup
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: it only creates what is missing.

-- ---------------------------------------------------------------------------
-- Admins: only users listed here can change products and photos.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  name_sw text,                                             -- Swahili name (optional; English is used if empty)
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories add column if not exists name_sw text;

alter table public.categories enable row level security;

drop policy if exists "categories are public" on public.categories;
create policy "categories are public" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id bigint references public.categories (id) on delete set null,
  price numeric(14, 0) check (price is null or price >= 0), -- TSh; null = "Call for price"
  description text not null default '',
  description_sw text,                                      -- Swahili description (optional; English is used if empty)
  images text[] not null default '{}',                      -- paths in the product-photos bucket; first = main photo
  in_stock boolean not null default true,
  is_featured boolean not null default false,
  is_visible boolean not null default true,                 -- false = hidden from the website
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists description_sw text;

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_created_idx on public.products (created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.products enable row level security;

drop policy if exists "visible products are public" on public.products;
create policy "visible products are public" on public.products
  for select to anon, authenticated using (is_visible or public.is_admin());

drop policy if exists "admins insert products" on public.products;
create policy "admins insert products" on public.products
  for insert to authenticated with check (public.is_admin());

drop policy if exists "admins update products" on public.products;
create policy "admins update products" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete products" on public.products;
create policy "admins delete products" on public.products
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Photo storage: public bucket, only admins can upload or delete.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-photos', 'product-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "admins upload product photos" on storage.objects;
create policy "admins upload product photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-photos' and public.is_admin());

drop policy if exists "admins update product photos" on storage.objects;
create policy "admins update product photos" on storage.objects
  for update to authenticated using (bucket_id = 'product-photos' and public.is_admin());

drop policy if exists "admins delete product photos" on storage.objects;
create policy "admins delete product photos" on storage.objects
  for delete to authenticated using (bucket_id = 'product-photos' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Starting categories (from MTG's current list). Edit them later in /admin/categories.
-- ---------------------------------------------------------------------------
insert into public.categories (name, name_sw, slug, sort_order) values
  ('Baby and Nursery', 'Watoto Wachanga na Malezi', 'baby-and-nursery', 10),
  ('Bathing Accessories', 'Vifaa vya Kuogea', 'bathing-accessories', 20),
  ('Beans', 'Maharage', 'beans', 30),
  ('Brain & Memory', 'Ubongo na Kumbukumbu', 'brain-and-memory', 40),
  ('Children Health', 'Afya ya Watoto', 'children-health', 50),
  ('Children Play and Learning', 'Michezo na Elimu ya Watoto', 'children-play-and-learning', 60),
  ('Cholesterol', 'Lehemu (Cholesterol)', 'cholesterol', 70),
  ('Cleaning and Air Freshener', 'Usafi na Viburudisha Hewa', 'cleaning-and-air-freshener', 80),
  ('Cleanser', 'Visafishaji Ngozi', 'cleanser', 90),
  ('Constipation Treatment', 'Tiba ya Kukosa Choo', 'constipation-treatment', 100),
  ('Dental', 'Afya ya Kinywa na Meno', 'dental', 110),
  ('Deodorant and Antiperspirants', 'Deodoranti na Vizuia Jasho', 'deodorant-and-antiperspirants', 120),
  ('Diabetic Vitamins', 'Vitamini kwa Wenye Kisukari', 'diabetic-vitamins', 130),
  ('Diet and Weight Management', 'Lishe na Udhibiti wa Uzito', 'diet-and-weight-management', 140),
  ('Digestive Health', 'Afya ya Mmeng''enyo wa Chakula', 'digestive-health', 150),
  ('Energy', 'Nguvu na Nishati', 'energy', 160),
  ('Everyday Living Aid', 'Vifaa vya Matumizi ya Kila Siku', 'everyday-living-aid', 170),
  ('Eye Health', 'Afya ya Macho', 'eye-health', 180),
  ('Face Wash', 'Sabuni za Uso', 'face-wash', 190),
  ('Fragrance', 'Manukato', 'fragrance', 200),
  ('Hair Care', 'Utunzaji wa Nywele', 'hair-care', 210),
  ('Hair, Nails & Skin', 'Nywele, Kucha na Ngozi', 'hair-nails-and-skin', 220),
  ('Health and Safety', 'Afya na Usalama', 'health-and-safety', 230),
  ('Heart & Circulation', 'Moyo na Mzunguko wa Damu', 'heart-and-circulation', 240),
  ('Home and Gardens', 'Nyumbani na Bustani', 'home-and-gardens', 250),
  ('Immune Support', 'Kinga ya Mwili', 'immune-support', 260),
  ('Joint Health', 'Afya ya Viungo', 'joint-health', 270),
  ('Kidney Support', 'Afya ya Figo', 'kidney-support', 280)
on conflict (slug) do update set name_sw = coalesce(public.categories.name_sw, excluded.name_sw);

-- ---------------------------------------------------------------------------
-- After creating the owner's login (Authentication -> Users -> Add user),
-- make that account an admin by running (with the real email):
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'owner@example.com';
-- ---------------------------------------------------------------------------
