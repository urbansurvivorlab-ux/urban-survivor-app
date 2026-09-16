import type { VercelRequest, VercelResponse } from '@vercel/node';
import { reminderTable } from '../_lib/supabase';
import { sendReminderEmail } from '../_lib/email';

// Vercel Cronから毎日呼ばれる。CRON_SECRETで、外部から誰でもトリガーできないように保護する。
// （Vercel Cronは自動的に Authorization: Bearer <CRON_SECRET> を付けてリクエストする）
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const nowIso = new Date().toISOString();

    const { data: dueRows, error: selectError } = await reminderTable()
      .select('id, email, manage_token, interval_months')
      .eq('active', true)
      .lte('next_send_at', nowIso)
      .limit(200); // 1回の実行での送信上限（現状の規模ではこれで十分すぎる）

    if (selectError) throw selectError;

    const results: { email: string; ok: boolean }[] = [];

    for (const row of dueRows ?? []) {
      try {
        await sendReminderEmail(row.email, row.manage_token);
        const intervalMonths = row.interval_months || 6;
        const nextSendAt = new Date();
        nextSendAt.setMonth(nextSendAt.getMonth() + intervalMonths);

        const { error: updateError } = await reminderTable()
          .update({ last_sent_at: nowIso, next_send_at: nextSendAt.toISOString() })
          .eq('id', row.id);
        if (updateError) throw updateError;

        results.push({ email: row.email, ok: true });
      } catch (sendError) {
        console.error(`Failed to send reminder to ${row.email}:`, sendError);
        results.push({ email: row.email, ok: false });
      }
    }

    res.status(200).json({ sent: results.filter((r) => r.ok).length, total: results.length });
  } catch (error) {
    console.error('cron/send-reminders error:', error);
    res.status(500).json({ error: '送信処理に失敗しました' });
  }
}
