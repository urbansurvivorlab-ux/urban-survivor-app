import type { Category } from '../types';

// 実用書「都市型サバイバー 家庭防災スコアカード：わが家の弱点が分かる本」のAmazon販売ページURL。
// 2026-09-19・ASIN発行確認（B0HK8KKL9S）を受け設定。Amazonアソシエイト・プログラムは
// 2026-09-12に閉鎖済みのためアフィリエイトタグは付与しない（再申請時に追加検討）。
export const BOOK_AMAZON_URL = 'https://www.amazon.co.jp/dp/B0HK8KKL9S';

// 実用書は診断と同じ10カテゴリ・章立てで構成されているため、
// 診断結果の弱点カテゴリをそのまま対応する章番号に紐づけて、
// 「この弱点は本の第N章で詳しく解説しています」と具体的に案内する。
export const CATEGORY_CHAPTER: Record<Category, number> = {
  organize: 1,
  risk: 2,
  finance: 3,
  design: 4,
  environment: 5,
  capacity: 6,
  society: 7,
  lifeline: 8,
  response: 9,
  recovery: 10,
};
