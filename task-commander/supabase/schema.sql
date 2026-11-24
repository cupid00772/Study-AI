-- ============================================================================
-- Task Commander 2.0 — Supabase Cloud Sync Schema & Storage Setup
-- ============================================================================
-- 使用方式：
-- 1. 前往 Supabase Dashboard -> SQL Editor -> New query
-- 2. 完整貼上本檔案內容並點選 Run
-- 3. 前往 Authentication -> Providers -> Email：關閉「Allow new users to sign up」
-- 4. 前往 Authentication -> Users -> Add user：建立你本人專用的單一帳號（Email + 自訂密碼）
--    （此設計讓任何裝置開網頁即可「免登入直接看資料」，首次編輯時輸入一次密碼即永久解鎖寫入）
-- ============================================================================

-- 1. 核心跨裝置同步資料表（10 個獨立資料域 + 檔案索引 asset_manifest）
create table if not exists public.tc_sync_docs (
  key text primary key,
  payload jsonb not null default '{}'::jsonb,
  version bigint not null default 1,
  updated_at timestamptz not null default now(),
  updated_by text not null default 'unknown'
);

-- 自動遞增版本號與更新時間戳 Trigger
create or replace function public.tc_sync_docs_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' then
    new.version := coalesce(old.version, 0) + 1;
  else
    new.version := coalesce(new.version, 1);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_tc_sync_docs_touch on public.tc_sync_docs;
create trigger trg_tc_sync_docs_touch
before insert or update on public.tc_sync_docs
for each row execute function public.tc_sync_docs_touch();

-- 2. 授予角色資料表存取權限並啟用 Row Level Security（選項 1：公開唯讀 + 單人帳號解鎖寫入）
grant usage on schema public to anon, authenticated;
grant select on table public.tc_sync_docs to anon;
grant select, insert, update, delete on table public.tc_sync_docs to authenticated;

alter table public.tc_sync_docs enable row level security;

drop policy if exists "tc_sync_docs_public_read" on public.tc_sync_docs;
create policy "tc_sync_docs_public_read"
  on public.tc_sync_docs
  for select
  using (true);

drop policy if exists "tc_sync_docs_auth_insert" on public.tc_sync_docs;
create policy "tc_sync_docs_auth_insert"
  on public.tc_sync_docs
  for insert
  to authenticated
  with check (true);

drop policy if exists "tc_sync_docs_auth_update" on public.tc_sync_docs;
create policy "tc_sync_docs_auth_update"
  on public.tc_sync_docs
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "tc_sync_docs_auth_delete" on public.tc_sync_docs;
create policy "tc_sync_docs_auth_delete"
  on public.tc_sync_docs
  for delete
  to authenticated
  using (true);

-- 3. 啟用 Supabase Realtime 推播（可重複執行不報錯）
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tc_sync_docs'
  ) then
    alter publication supabase_realtime add table public.tc_sync_docs;
  end if;
end
$$;

-- 4. 建立教材與題庫雲端儲存桶 study-assets（單檔上限 15 MB，公開讀取、登入寫入）
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('study-assets', 'study-assets', true, 15728640, null)
on conflict (id) do update
set public = true,
    file_size_limit = 15728640;

drop policy if exists "study_assets_public_read" on storage.objects;
create policy "study_assets_public_read"
  on storage.objects
  for select
  using (bucket_id = 'study-assets');

drop policy if exists "study_assets_auth_insert" on storage.objects;
create policy "study_assets_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'study-assets');

drop policy if exists "study_assets_auth_update" on storage.objects;
create policy "study_assets_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'study-assets')
  with check (bucket_id = 'study-assets');

drop policy if exists "study_assets_auth_delete" on storage.objects;
create policy "study_assets_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'study-assets');

-- ============================================================================
-- [備用] 若你確實想完全免解鎖開放匿名寫入（選項 2，較不建議用於 Public Repo），
-- 可手動取消以下註解執行：
--
-- drop policy if exists "tc_sync_docs_anon_all" on public.tc_sync_docs;
-- create policy "tc_sync_docs_anon_all" on public.tc_sync_docs for all to anon using (true) with check (true);
-- drop policy if exists "study_assets_anon_write" on storage.objects;
-- create policy "study_assets_anon_write" on storage.objects for insert to anon with check (bucket_id = 'study-assets');
-- drop policy if exists "study_assets_anon_update" on storage.objects;
-- create policy "study_assets_anon_update" on storage.objects for update to anon using (bucket_id = 'study-assets');
-- ============================================================================

