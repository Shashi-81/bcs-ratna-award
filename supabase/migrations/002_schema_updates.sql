-- ─────────────────────────────────────────────────────────────
-- BCS Ratna Award 2026 – Schema Updates (Migration 002)
-- Run this in Supabase SQL Editor AFTER migration 001
-- ─────────────────────────────────────────────────────────────

-- 1. Add `updated_at` to users table (for upsert support)
alter table public.users
  add column if not exists updated_at timestamptz not null default now();

-- Trigger for users updated_at
drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- 2. Add `razorpay_signature` to nominations (for payment verification)
alter table public.nominations
  add column if not exists razorpay_signature text;

-- 3. Add select policy for users (admin panel needs to read users)
drop policy if exists "public_read_users" on public.users;
create policy "public_read_users" on public.users
  for select to anon, authenticated
  using (true);

-- 4. Add select policy for uploaded_files
drop policy if exists "public_read_files" on public.uploaded_files;
create policy "public_read_files" on public.uploaded_files
  for select to anon, authenticated
  using (true);

-- 5. Add select policy for payments
drop policy if exists "public_read_payments" on public.payments;
create policy "public_read_payments" on public.payments
  for select to anon, authenticated
  using (true);

-- 6. Add read policy for storage buckets
drop policy if exists "public_read_nomination_files" on storage.objects;
create policy "public_read_nomination_files" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'nomination-files');

drop policy if exists "public_read_payment_proofs" on storage.objects;
create policy "public_read_payment_proofs" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'payment-proofs');

-- Note: landline and source columns remain in users table (nullable)
-- They are not used in the current form but kept for backward compatibility
-- nominee details (nominee_name, company_name, why_deserves, photo_url)
-- are stored inside the entries JSONB column of nominations table
