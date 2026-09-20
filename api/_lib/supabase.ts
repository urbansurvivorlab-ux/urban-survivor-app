import { createClient } from '@supabase/supabase-js';

export interface ReminderSubscription {
  id: string;
  email: string;
  active: boolean;
  interval_months: number;
  manage_token: string;
  created_at: string;
  last_sent_at: string | null;
  next_send_at: string;
}

// このテーブル1つのために完全なcodegen型（Database型）を用意する代わりに、
// `.from()` 呼び出しそのものに直接ジェネリクスを渡す軽量な方式を使う。
// (トップレベルのDatabase型をcreateClient<Database>()に渡す方式は、
//  このバージョンのsupabase-jsではスキーマ解決がうまく通らずクエリ結果が
//  すべてnever型になってしまったため採用しなかった)
type ReminderTableDef = {
  Row: ReminderSubscription;
  Insert: Partial<ReminderSubscription> & { email: string };
  Update: Partial<ReminderSubscription>;
  Relationships: [];
};

function createAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が未設定です');
  }

  // createClientはオーバーロード関数のため `ReturnType<typeof createClient>` で
  // 型を取ると最後のオーバーロードに潰されてしまう。単一シグネチャの関数で
  // 包むことで、この呼び出し固有の戻り値型を正しく推論させる。
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// サーバー側（Vercel Functions）専用。service role keyはフロントには絶対に露出させない。
let cachedClient: ReturnType<typeof createAdminClient> | null = null;

function getClient() {
  if (!cachedClient) {
    cachedClient = createAdminClient();
  }
  return cachedClient;
}

export function getSupabaseAdmin() {
  return getClient();
}

// 型付きで reminder_subscriptions テーブルにアクセスするためのヘルパー。
// 各APIハンドラはこの関数経由でテーブルを操作する。
export function reminderTable() {
  return getClient().from<'reminder_subscriptions', ReminderTableDef>(
    'reminder_subscriptions'
  );
}
