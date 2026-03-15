-- Supabase SQL Editor'da calistirin. Influencer tablosu + herkesin gorebilmesi icin RLS.

create table if not exists public.influencers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  username text not null,
  full_name text,
  avatar_url text,
  instagram_handle text,
  followers int default 0,
  city text,
  cities jsonb default '[]',
  categories jsonb default '[]',
  collaboration_types jsonb default '[]',
  bio text,
  created_at timestamptz default now()
);

alter table public.influencers enable row level security;

-- Herkes (anon dahil) tum influencerlari okuyabilir
create policy "Influencers are viewable by everyone"
  on public.influencers for select
  using (true);

-- Sadece giris yapan kullanici kendi kaydini ekleyebilir
create policy "Users can insert own influencer"
  on public.influencers for insert
  with check (auth.uid() = user_id);

-- Sadece kendi kaydini guncelleyebilir / silebilir
create policy "Users can update own influencer"
  on public.influencers for update
  using (auth.uid() = user_id);

create policy "Users can delete own influencer"
  on public.influencers for delete
  using (auth.uid() = user_id);
