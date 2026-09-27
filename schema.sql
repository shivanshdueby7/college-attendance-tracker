-- Anonymous install heartbeats for Attendance Ledger admin stats.
-- Run once in Supabase SQL editor (or any Postgres). No PII stored by design.
create table if not exists heartbeats (
  install_id text primary key,
  platform text not null default 'web',
  app_version int not null default 1,
  subjects int not null default 0,
  marks int not null default 0,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);
-- Service key bypasses RLS; keep the table out of the public anon role:
-- (default: no policies = anon role cannot read/write; service_role bypasses RLS)
