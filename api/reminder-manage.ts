import type { VercelRequest, VercelResponse } from '@vercel/node';
import { reminderTable } from './_lib/supabase';

// メール本文の「配信停止」リンク（GETでブラウザから直接開かれる）と、
// アプリ内トグルスイッチ（fetchで叩く）の両方から呼ばれる共通エンドポイント。
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = typeof req.query.token === 'string' ? req.query.token : undefined;
  const action = typeof req.query.action === 'string' ? req.query.action : undefined;

  if (!token || (action !== 'toggle' && action !== 'unsubscribe' && action !== 'resubscribe')) {
    res.status(400).json({ error: 'token・actionが不正です' });
    return;
  }

  try {
    const { data: row, error: selectError } = await reminderTable()
      .select('id, active')
      .eq('manage_token', token)
      .maybeSingle();

    if (selectError) throw selectError;
    if (!row) {
      res.status(404).json({ error: '購読情報が見つかりません' });
      return;
    }

    let nextActive: boolean;
    if (action === 'unsubscribe') nextActive = false;
    else if (action === 'resubscribe') nextActive = true;
    else nextActive = !row.active; // toggle

    const { error: updateError } = await reminderTable()
      .update({ active: nextActive })
      .eq('id', row.id);
    if (updateError) throw updateError;

    // メールのリンクから直接開かれた場合はブラウザで見て分かるHTMLを返す
    const acceptsHtml = (req.headers.accept ?? '').includes('text/html');
    if (acceptsHtml && (action === 'unsubscribe' || action === 'resubscribe')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(
        `<!doctype html><html lang="ja"><meta charset="utf-8"><body style="font-family:sans-serif;padding:40px;text-align:center;">` +
          `<p>${nextActive ? '定期リマインドの配信を再開しました。' : '定期リマインドの配信を停止しました。'}</p>` +
          `</body></html>`
      );
      return;
    }

    res.status(200).json({ active: nextActive });
  } catch (error) {
    console.error('reminder-manage error:', error);
    res.status(500).json({ error: '処理に失敗しました' });
  }
}
