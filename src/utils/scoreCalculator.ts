import type { Category } from '../types';

export const calculateWeakPoints = (
  categoryScores: Record<Category, number>
) => {
  // 各カテゴリの満点（10問 × 最大10点 = 100点）
  const maxScores: Record<Category, number> = {
    infrastructure: 100,
    stockpile: 100,
    communication: 100,
    evacuation: 100,
    governance: 100
  };

  const weakPoints: { name: Category; label: string; score: number; ratio: number }[] = [];

  const categoryLabels: Record<Category, string> = {
    infrastructure: '物理的安全性・インフラ',
    stockpile: '物資供給・兵站',
    communication: '情報通信・状況把握',
    evacuation: '避難行動・装備',
    governance: '社会的配慮・ガバナンス'
  };

  Object.entries(categoryScores).forEach(([cat, score]) => {
    const category = cat as Category;
    const max = maxScores[category];
    const ratio = score / max;

    // 満点比率が50%未満を弱点とする（より厳格な判定）
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
