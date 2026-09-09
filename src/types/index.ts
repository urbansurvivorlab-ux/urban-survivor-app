export type Category = 'infrastructure' | 'stockpile' | 'communication' | 'evacuation' | 'governance';

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
  pets: string;
  housingType: string;
  region: string;
}

export interface DiagnosisResult {
  infrastructure: number;
  stockpile: number;
  communication: number;
  evacuation: number;
  governance: number;
  total: number;
}

export interface HistoryRecord {
  id: string;
  date: string; // ISO string
  totalScore: number;
  categoryScores: Record<Category, number>;
}
