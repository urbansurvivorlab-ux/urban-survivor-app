import { Resend } from 'resend';
import type { AnniversaryKind } from './anniversary';

let cachedClient: Resend | null = null;

function getResendClient() {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY が未設定です');
  }
  cachedClient = new Resend(apiKey);
  return cachedClient;
}

const APP_URL = 'https://urban-survivor-app.vercel.app';
const SENDER_NAME = '家庭防災スコアカード（合同会社マーブルサイン）';

// 特定電子メール法対応：本文に送信者情報・配信停止方法を必ず含める
function footer(manageToken: string) {
  const manageUrl = `${APP_URL}/api/reminder-manage?token=${manageToken}&action=unsubscribe`;
  return `
---
このメールは「家庭防災スコアカード」アプリ（https://urban-survivor-app.vercel.app/）へのご登録に基づいてお送りしています。
配信元：合同会社マーブルサイン

今後の配信を停止する場合はこちら：
${manageUrl}
`;
}

export async function sendWelcomeEmail(email: string, manageToken: string) {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error('RESEND_FROM_EMAIL が未設定です');

  await resend.emails.send({
    from: `${SENDER_NAME} <${from}>`,
    to: email,
    subject: '【登録完了】家庭防災スコアカード 定期リマインド',
    text: `ご登録ありがとうございます。

これから約6ヶ月ごとに、防災力の再診断をおすすめするメールをお送りします。
備えは一度整えて終わりではなく、家族の状況や季節に合わせて回し続けるものです。半年に一度、この機会に見直してみてください。

今すぐ診断してみる：
${APP_URL}/profile
${footer(manageToken)}`,
  });
}

// 防災の記念日は、悲しみを利用するのではなく「その日を、備えを見直すきっかけにする」という
// 建設的な文脈にとどめる。171体験利用期間（1/17・9/1）は実際に手を動かせる行動として案内する。
function reminderContent(anchor: AnniversaryKind): { subject: string; intro: string } {
  switch (anchor) {
    case 'hanshin':
      return {
        subject: '1月17日、阪神・淡路大震災の日に——備えを見直す一日に',
        intro: `1月17日は、阪神・淡路大震災が起きた日です。

この日は「防災とボランティア週間」（1/15〜1/21）にあたり、災害用伝言ダイヤル（171）を実際に体験利用できる期間でもあります（171にかけて、録音・再生を試せます）。せっかくの機会なので、ご家族との連絡方法を実際に確認してみるのもおすすめです。`,
      };
    case 'tohoku':
      return {
        subject: '3月11日、東日本大震災の日に——備えを見直す一日に',
        intro: `3月11日は、東日本大震災が起きた日です。

前回の診断から時間が経ち、家族の状況や季節も変わっているかもしれません。この機会に、もう一度チェックしてみませんか。`,
      };
    case 'bousai':
      return {
        subject: '9月1日は「防災の日」——備えを見直す一日に',
        intro: `9月1日は「防災の日」です。

この日を含む「防災週間」（8/30〜9/5）は、災害用伝言ダイヤル（171）を実際に体験利用できる期間でもあります（171にかけて、録音・再生を試せます）。せっかくの機会なので、ご家族との連絡方法を実際に確認してみるのもおすすめです。`,
      };
    default:
      return {
        subject: '半年ぶりの防災力チェック、いかがですか？',
        intro: `前回の診断から約6ヶ月が経ちました。

家族の状況や季節が変わると、必要な備えも変わります。もう一度チェックして、我が家の弱点が変わっていないか確認してみませんか。`,
      };
  }
}

export async function sendReminderEmail(
  email: string,
  manageToken: string,
  anchor: AnniversaryKind = null
) {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error('RESEND_FROM_EMAIL が未設定です');

  const { subject, intro } = reminderContent(anchor);

  await resend.emails.send({
    from: `${SENDER_NAME} <${from}>`,
    to: email,
    subject,
    text: `${intro}

再診断する：
${APP_URL}/profile
${footer(manageToken)}`,
  });
}
