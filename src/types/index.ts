export type Category =
  | 'organize'     // 第1要素 組織体制
  | 'risk'         // 第2要素 リスクの把握
  | 'finance'      // 第3要素 財政基盤
  | 'design'       // 第4要素 都市開発・設計
  | 'environment'  // 第5要素 自然の緩衝機能（住む場所を選ぶ基準）
  | 'capacity'     // 第6要素 組織能力強化
  | 'society'      // 第7要素 社会的能力
  | 'lifeline'     // 第8要素 インフラ強靭化
  | 'response'     // 第9要素 効果的な災害対応
  | 'recovery';    // 第10要素 復興の迅速化

export interface AnswerOption {
  label: string;
  score: number;
}

export interface Question {
  id: string;
  category: Category;
  text: string;
  options: AnswerOption[];
}

export interface UserProfile {
  familySize: number;
  children: number;
  elderly: number;
  disabled: number;
  pets: string;
  housingType: string;
}

export interface DiagnosisResult {
  organize: number;
  risk: number;
  finance: number;
  design: number;
  environment: number;
  capacity: number;
  society: number;
  lifeline: number;
  response: number;
  recovery: number;
  total: number;
}

export interface HistoryRecord {
  id: string;
  date: string; // ISO string
  totalScore: number;
  categoryScores: Record<Category, number>;
}
