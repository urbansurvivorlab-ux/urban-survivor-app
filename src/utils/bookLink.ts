import type { Category } from '../types';

// 実用書「都市型サバイバー 家庭防災スコアカード：わが家の弱点が分かる本」のAmazon販売ページURL。
// Kindle出版が完了しASINが発行されたらここに設定する。空の間は関連カード自体を表示しない
// （Result.tsx・Mission.tsxで共通利用）。
export const BOOK_AMAZON_URL = '';

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
