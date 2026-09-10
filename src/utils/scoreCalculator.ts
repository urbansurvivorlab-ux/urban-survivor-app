import type { Category } from '../types';
import { questions } from '../data/questions';
import { getMaxScore } from './personalization';

const ALL_CATEGORIES: Category[] = [
  'organize', 'risk', 'finance', 'design', 'environment',
  'capacity', 'society', 'lifeline', 'response', 'recovery'
];

// カテゴリごとの問数が不均等（アプリ限定の追加設問も含む）なため、
// 満点は設問データから動的に算出する。questions.tsを変更しても自動的に追従する。
export const maxScores: Record<Category, number> = ALL_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = 0;
  return acc;
}, {} as Record<Category, number>);

questions.forEach((q) => {
  maxScores[q.category] += getMaxScore(q);
});

// UNDRR「Ten Essentials」の用語（都市・自治体スケール）をそのまま使うと家庭には
// 分かりにくいため、実用書10章版の各章副題に合わせて家庭向けの呼び名に翻訳している。
// 実用書側にも同じ呼び名を併記している（担当者報告/シン/20260909_スコアカード実用書_原稿_10章版.md）。
export const categoryLabels: Record<Category, string> = {
  organize: '家族の体制',
  risk: '危険の把握',
  finance: 'お金の備え',
  design: '住まいの安全',
  environment: '住む場所選び',
  capacity: '訓練と実践',
  society: '地域との協力',
  lifeline: 'ライフライン',
  response: '発災時の初動',
  recovery: '生活再建'
};

export const calculateWeakPoints = (
  categoryScores: Record<Category, number>
) => {
  const weakPoints: { name: Category; label: string; score: number; ratio: number }[] = [];

  Object.entries(categoryScores).forEach(([cat, score]) => {
    const category = cat as Category;
    const max = maxScores[category];
    const ratio = score / max;

    // 達成率50%未満を弱点とする（より厳格な判定）
    if (ratio < 0.5) {
      weakPoints.push({
        name: category,
        label: categoryLabels[category],
        score,
        ratio
      });
    }
  });

  // 比率が低い（より深刻な弱点）順にソートして返す
  weakPoints.sort((a, b) => a.ratio - b.ratio);

  return weakPoints;
};

export const getLevelText = (totalScore: number): string => {
  if (totalScore < 30) return "危険領域：無防備な都市";
  if (totalScore < 50) return "警戒領域：脆弱な基盤";
  if (totalScore < 70) return "サバイバー見習い";
  if (totalScore < 90) return "都市型サバイバー";
  return "完全なる防衛拠点（マスター）";
};
