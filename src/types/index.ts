export type Category = 'management' | 'education' | 'infrastructure' | 'stockpile' | 'finance' | 'community';

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
  management: number;
  education: number;
  infrastructure: number;
  stockpile: number;
  finance: number;
  community: number;
  total: number;
}

export interface HistoryRecord {
  id: string;
  date: string; // ISO string
  totalScore: number;
  categoryScores: Record<Category, number>;
}
