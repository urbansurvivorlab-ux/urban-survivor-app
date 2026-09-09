import type { Category } from '../types';

// カテゴリごとの問数が5・5・5・5・4・5・5・9・4・3と不均等なため、満点もカテゴリごとに変わる（各設問10点満点×問数）
export const maxScores: Record<Category, number> = {
  organize: 50,     // 5問
  risk: 50,         // 5問
  finance: 50,       // 5問
  design: 50,        // 5問
  environment: 40,   // 4問
  capacity: 50,       // 5問
  society: 50,        // 5問
  lifeline: 90,        // 9問
  response: 40,         // 4問
  recovery: 30           // 3問
};

export const categoryLabels: Record<Category, string> = {
  organize: '組織体制',
  risk: 'リスクの把握',
  finance: '財政基盤',
  design: '都市開発・設計',
  environment: '自然の緩衝機能',
  capacity: '組織能力強化',
  society: '社会的能力',
  lifeline: 'インフラ強靭化',
  response: '効果的な災害対応',
  recovery: '復興の迅速化'
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
