-- 家庭防災スコアカードアプリ：定期診断リマインドメールの購読テーブル
-- 2026-09-17 作成

create table if not exists reminder_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  active boolean not null default true,
  interval_months int not null default 6,
  manage_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  last_sent_at timestamptz,
  next_send_at timestamptz not null default (now() + interval '6 months')
);

-- cronジョブが「送信対象を今すぐ探す」時に使う複合条件のためのインデックス
create index if not exists reminder_subscriptions_due_idx
  on reminder_subscriptions (active, next_send_at);

comment on table reminder_subscriptions is '家庭防災スコアカードアプリの定期診断リマインドメール購読者。登録・配信停止はmanage_token（メール内リンク・アプリ内トグルの両方で共通）で認証する。';
