
create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  type text not null default 'build',
  status text not null default 'draft',
  excerpt text,
  body text,
  project_id uuid references public.projects(id) on delete set null,
  cover_asset_id uuid references public.assets(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_items_type_check check (type in ('work','build','archive')),
  constraint content_items_status_check check (status in ('draft','published'))
);

create unique index content_items_slug_type on public.content_items (slug, type);
create index content_items_type_status on public.content_items (type, status);
create index content_items_project_id on public.content_items (project_id);

-- RLS
alter table public.content_items enable row level security;

create policy "content_items_read_published"
  on public.content_items for select
  using (status = 'published' or is_owner());

create policy "content_items_owner_write"
  on public.content_items for all
  using (is_owner())
  with check (is_owner());

-- updated_at trigger
create trigger content_items_updated_at
  before update on public.content_items
  for each row execute function set_updated_at();
