import type { Question, UserProfile } from '../types';

// 設問の満点（選択肢の最大点）
export const getMaxScore = (question: Question): number =>
  Math.max(...question.options.map((o) => o.score));

// 世帯情報から見て「該当なし」が明らかな設問のうち、実用書50問には含まれない
// アプリ限定の追加設問（care_1・care_2）だけを自動スキップの対象にする。
// org_3（子どもの引き渡しルール）・org_4（ペットの同行避難）は実用書50問に含まれる設問のため、
// 自動スキップすると世帯によって出題数が50問から変動してしまう（例：子ども・ペットがいない世帯で48問になる）。
// 本文と同じ「該当なしの場合は自分で選ぶ」設計に揃え、常に50問（+該当する追加設問）を維持する。
const AUTO_SKIP_RULES: Record<string, (profile: UserProfile) => boolean> = {
  care_1: (profile) => profile.elderly === 0,  // 高齢者の避難時介助・投薬管理（アプリ限定設問）
  care_2: (profile) => profile.disabled === 0, // 身体障がい者・要配慮者の福祉避難所登録（アプリ限定設問）
};

export const shouldAutoSkip = (question: Question, profile: UserProfile): boolean => {
  const rule = AUTO_SKIP_RULES[question.id];
  return rule ? rule(profile) : false;
};

// 世帯人数に応じた備蓄量の個別計算（水・非常食・簡易トイレ）
export const getPersonalizedHint = (question: Question, profile: UserProfile): string | null => {
  const n = Math.max(1, profile.familySize);
  switch (question.id) {
    case 'life_1': // 飲料水（1人1日3L）
      return `あなたの世帯（${n}人）の目安：3日分 ${n * 9}L ／ 7日分 ${n * 21}L`;
    case 'life_2': // 非常食（1人1日3食換算）
      return `あなたの世帯（${n}人）の目安：3日分 ${n * 9}食 ／ 7日分 ${n * 21}食`;
    case 'life_3': // 簡易トイレ（1人1日5回換算）
      return `あなたの世帯（${n}人）の目安：3日分 ${n * 15}回分 ／ 7日分 ${n * 35}回分`;
    default:
      return null;
  }
};
