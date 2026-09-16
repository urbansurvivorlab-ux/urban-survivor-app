import type { VercelRequest, VercelResponse } from '@vercel/node';
import { reminderTable } from './_lib/supabase';
import { sendWelcomeEmail } from './_lib/email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email } = (req.body ?? {}) as { email?: string };
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    res.status(400).json({ error: '有効なメールアドレスを入力してください' });
    return;
  }

  try {
    // 既存の登録があれば再アクティブ化（トークンは維持し、同じ端末以外からの再登録でも
    // 従来の配信停止リンクが引き続き機能するようにする）、無ければ新規作成
    const { data: existing, error: selectError } = await reminderTable()
      .select('manage_token, active')
      .eq('email', email)
      .maybeSingle();

    if (selectError) throw selectError;

    let manageToken: string;

    if (existing) {
      manageToken = existing.manage_token;
      const { error: updateError } = await reminderTable()
        .update({
          active: true,
          next_send_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6).toISOString(),
        })
        .eq('email', email);
      if (updateError) throw updateError;
    } else {
      const { data: inserted, error: insertError } = await reminderTable()
        .insert({ email })
        .select('manage_token')
        .single();
      if (insertError) throw insertError;
      manageToken = inserted.manage_token;
    }

    // 確認メールの送信失敗は登録自体の失敗として扱わない（Resend未設定の環境でも
    // 購読データの作成自体は完了させる。ログにだけ残す）
    try {
      await sendWelcomeEmail(email, manageToken);
    } catch (mailError) {
      console.error('Failed to send welcome email:', mailError);
    }

    res.status(200).json({ manageToken });
  } catch (error) {
    console.error('reminder-subscribe error:', error);
    res.status(500).json({ error: '登録に失敗しました。時間をおいて再度お試しください。' });
  }
}
