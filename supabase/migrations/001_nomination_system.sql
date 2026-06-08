-- ─────────────────────────────────────────────────────────────
-- BCS Ratna Award 2026 – Nomination System Schema
-- Safe to re-run: uses IF NOT EXISTS and DROP IF EXISTS
-- ─────────────────────────────────────────────────────────────

-- Enable extensions
create extension if not exists "uuid-ossp";

-- ── USERS (Registrants) ────────────────────────────────────────
create table if not exists public.users (
  id                  uuid primary key default uuid_generate_v4(),
  salutation          text not null,
  full_name           text not null,
  designation         text not null,
  company_name        text not null,
  department          text not null,
  email               text not null unique,
  mobile              text not null,
  city                text not null,
  pincode             text not null,
  address             text not null,
  landline            text,
  pan                 text,
  wants_invoice       boolean not null default false,
  gst_number          text,
  legal_company_name  text,
  billing_address     text,
  source              text,
  newsletter          boolean not null default false,
  created_at          timestamptz not null default now()
);

-- ── NOMINATIONS ────────────────────────────────────────────────
create table if not exists public.nominations (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid references public.users(id) on delete set null,
  registrant_email        text not null,
  registrant_name         text not null,
  entries                 jsonb not null default '[]',
  total_amount            numeric(10,2) not null default 0,
  status                  text not null default 'draft'
                          check (status in ('draft','pending_payment','paid','approved','rejected')),
  payment_method          text,
  payment_screenshot_url  text,
  transaction_id          text,
  payment_reference       text,
  razorpay_order_id       text,
  razorpay_payment_id     text,
  declaration_agreed      boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ── PAYMENTS ───────────────────────────────────────────────────
create table if not exists public.payments (
  id                    uuid primary key default uuid_generate_v4(),
  nomination_id         uuid references public.nominations(id) on delete cascade,
  amount                numeric(10,2) not null,
  method                text not null,
  status                text not null default 'pending'
                        check (status in ('pending','success','failed')),
  transaction_id        text,
  reference             text,
  screenshot_url        text,
  razorpay_order_id     text,
  razorpay_payment_id   text,
  razorpay_signature    text,
  created_at            timestamptz not null default now()
);

-- ── UPLOADED FILES ─────────────────────────────────────────────
create table if not exists public.uploaded_files (
  id              uuid primary key default uuid_generate_v4(),
  nomination_id   uuid references public.nominations(id) on delete cascade,
  entry_index     integer,
  file_type       text not null,
  file_url        text not null,
  original_name   text,
  size_bytes      bigint,
  created_at      timestamptz not null default now()
);

-- ── NEWSLETTER SUBSCRIBERS ─────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null unique,
  full_name   text,
  subscribed_at timestamptz not null default now()
);

-- ── AUDIT LOGS ─────────────────────────────────────────────────
create table if not exists public.audit_logs (
  id            uuid primary key default uuid_generate_v4(),
  table_name    text not null,
  record_id     uuid,
  action        text not null,
  old_data      jsonb,
  new_data      jsonb,
  performed_by  text,
  created_at    timestamptz not null default now()
);

-- ── ADMIN USERS ────────────────────────────────────────────────
create table if not exists public.admin_users (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null unique,
  role        text not null default 'admin' check (role in ('super_admin','admin','viewer')),
  created_at  timestamptz not null default now()
);

-- ── INDEXES ────────────────────────────────────────────────────
create index if not exists idx_nominations_email    on public.nominations(registrant_email);
create index if not exists idx_nominations_status   on public.nominations(status);
create index if not exists idx_nominations_created  on public.nominations(created_at desc);
create index if not exists idx_payments_nomination  on public.payments(nomination_id);
create index if not exists idx_users_email          on public.users(email);

-- ── UPDATED_AT TRIGGER ─────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists nominations_updated_at on public.nominations;
create trigger nominations_updated_at
  before update on public.nominations
  for each row execute function public.set_updated_at();

-- ── ROW LEVEL SECURITY ─────────────────────────────────────────
alter table public.users               enable row level security;
alter table public.nominations         enable row level security;
alter table public.payments            enable row level security;
alter table public.uploaded_files      enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.audit_logs          enable row level security;
alter table public.admin_users         enable row level security;

-- ── DROP OLD POLICIES (safe re-run) ───────────────────────────
drop policy if exists "public_insert_users"              on public.users;
drop policy if exists "public_insert_nominations"        on public.nominations;
drop policy if exists "public_insert_payments"           on public.payments;
drop policy if exists "public_insert_files"              on public.uploaded_files;
drop policy if exists "public_insert_newsletter"         on public.newsletter_subscribers;
drop policy if exists "public_read_own_nomination"       on public.nominations;
drop policy if exists "public_update_own_nomination"     on public.nominations;
drop policy if exists "public_upload_nomination_files"   on storage.objects;
drop policy if exists "public_upload_payment_proofs"     on storage.objects;

-- ── CREATE POLICIES ───────────────────────────────────────────

-- Users table
create policy "public_insert_users" on public.users
  for insert to anon, authenticated with check (true);

create policy "public_read_users" on public.users
  for select to anon, authenticated using (true);

create policy "public_update_users" on public.users
  for update to anon, authenticated using (true);

-- Nominations table
create policy "public_insert_nominations" on public.nominations
  for insert to anon, authenticated with check (true);

create policy "public_read_own_nomination" on public.nominations
  for select to anon, authenticated using (true);

create policy "public_update_own_nomination" on public.nominations
  for update to anon, authenticated using (true);

-- Payments table
create policy "public_insert_payments" on public.payments
  for insert to anon, authenticated with check (true);

create policy "public_read_payments" on public.payments
  for select to anon, authenticated using (true);

-- Uploaded files table
create policy "public_insert_files" on public.uploaded_files
  for insert to anon, authenticated with check (true);

-- Newsletter
create policy "public_insert_newsletter" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

-- ── STORAGE BUCKETS ────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values
  ('nomination-files', 'nomination-files', false),
  ('payment-proofs',   'payment-proofs',   false)
on conflict (id) do nothing;

create policy "public_upload_nomination_files" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'nomination-files');

create policy "public_upload_payment_proofs" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'payment-proofs');

create policy "public_read_nomination_files" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'nomination-files' or bucket_id = 'payment-proofs');
