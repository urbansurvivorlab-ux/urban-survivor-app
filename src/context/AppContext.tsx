import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile, Category, HistoryRecord } from '../types';
import type { AffiliateItem } from '../data/affiliateItems';
import { questions } from '../data/questions';
import Papa from 'papaparse';

// スプレッドシート（CSV公開）のURL
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR1Bf9KWqBkzpoDDSPXKCCNaRAyI0YAdUFYHcJO9C3-1-f8_vZ80q56I0xX-SFouCU4FCEWrz5Qzpnf/pub?output=csv';

interface AppState {
  profile: UserProfile;
  answers: Record<string, number>;
  totalScore: number;
  categoryScores: Record<Category, number>;
  history: HistoryRecord[];
  affiliateItems: Record<Category, AffiliateItem[]> | null; // null means loading
}

interface AppContextType {
  state: AppState;
  setProfile: (profile: UserProfile) => void;
  setAnswer: (questionId: string, score: number) => void;
  calculateScores: () => void;
  resetDiagnosis: () => void;
}

const defaultProfile: UserProfile = {
  familySize: 1,
  children: 0,
  elderly: 0,
  pets: '0',
  housingType: 'マンション',
  region: '東京'
};

const initialState: AppState = {
  profile: defaultProfile,
  answers: {},
  totalScore: 0,
  categoryScores: {
    management: 0,
    education: 0,
    infrastructure: 0,
    stockpile: 0,
    finance: 0,
    community: 0
  },
  history: [],
  affiliateItems: null
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const setAnswer = (questionId: string, score: number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: score }
    }));
  };

  const calculateScores = () => {
    const newCategoryScores: Record<Category, number> = {
      management: 0, education: 0, infrastructure: 0, stockpile: 0, finance: 0, community: 0
    };

    let total = 0;

    // TODO: ここで全質問のスコアを集計する。
    // questions.tsの定義と現在のanswersを突き合わせて合計を出す
    Object.entries(state.answers).forEach(([qId, score]) => {
      const question = questions.find(q => q.id === qId);
      if (question) {
        newCategoryScores[question.category] += score;
        total += score;
      }
    });

    // 総合スコア（最大600点満点となるため、100点満点の平均値に換算）
    const finalTotal = Math.round(total / 6);

    // 履歴に追加
    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      totalScore: finalTotal,
      categoryScores: newCategoryScores
    };

    setState(prev => {
      const updatedHistory = [...prev.history, newRecord];
      // localStorageに保存
      localStorage.setItem('survivor_history', JSON.stringify(updatedHistory));
      
      return {
        ...prev,
        totalScore: finalTotal,
        categoryScores: newCategoryScores,
        history: updatedHistory
      };
    });
  };

  // 初回マウント時にlocalStorageから履歴を読み込む & スプレッドシートの取得
  useEffect(() => {
    const savedHistory = localStorage.getItem('survivor_history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setState(prev => ({ ...prev, history: parsedHistory }));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // CSV非同期フェッチ
    fetch(CSV_URL)
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
             const itemsByCategory: Record<Category, AffiliateItem[]> = {
               management: [], education: [], infrastructure: [], stockpile: [], finance: [], community: []
             };
             
             results.data.forEach((row: any, index) => {
                const category = row.category as Category;
                if (itemsByCategory[category]) {
                   itemsByCategory[category].push({
                      id: `csv_item_${index}`,
                      name: row.name,
                      description: row.description,
                      asin: row.asin
                   });
                }
             });

             setState(prev => ({ ...prev, affiliateItems: itemsByCategory }));
          }
        });
      })
      .catch(e => {
         console.error('Failed to load affiliate CSV:', e);
         // フォールバックとして空配列などを入れる（実際には元のTSファイルを使っても良い）
         setState(prev => ({ ...prev, affiliateItems: { management: [], education: [], infrastructure: [], stockpile: [], finance: [], community: [] } }));
      });
  }, []);

  const resetDiagnosis = () => {
    setState(prev => ({
      ...prev,
      answers: {},
      totalScore: 0,
      categoryScores: initialState.categoryScores
    }));
  };

  return (
    <AppContext.Provider value={{ state, setProfile, setAnswer, calculateScores, resetDiagnosis }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
