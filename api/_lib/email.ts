import { Resend } from 'resend';

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

export async function sendReminderEmail(email: string, manageToken: string) {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error('RESEND_FROM_EMAIL が未設定です');

  await resend.emails.send({
    from: `${SENDER_NAME} <${from}>`,
    to: email,
    subject: '半年ぶりの防災力チェック、いかがですか？',
    text: `前回の診断から約6ヶ月が経ちました。

家族の状況や季節が変わると、必要な備えも変わります。もう一度チェックして、我が家の弱点が変わっていないか確認してみませんか。

再診断する：
${APP_URL}/profile
${footer(manageToken)}`,
  });
}
