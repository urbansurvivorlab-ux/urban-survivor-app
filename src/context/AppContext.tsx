import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile, Category, HistoryRecord } from '../types';
import type { AffiliateItem } from '../data/affiliateItems';
import { affiliateItems as staticAffiliateItems } from '../data/affiliateItems';
import { questions } from '../data/questions';
import { maxScores } from '../utils/scoreCalculator';
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
  loadLatestResult: () => void;
}

const defaultProfile: UserProfile = {
  familySize: 1,
  children: 0,
  elderly: 0,
  disabled: 0,
  pets: '0',
  housingType: 'マンション'
};

const emptyCategoryScores: Record<Category, number> = {
  organize: 0, risk: 0, finance: 0, design: 0, environment: 0,
  capacity: 0, society: 0, lifeline: 0, response: 0, recovery: 0
};

const initialState: AppState = {
  profile: defaultProfile,
  answers: {},
  totalScore: 0,
  categoryScores: { ...emptyCategoryScores },
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
    const newCategoryScores: Record<Category, number> = { ...emptyCategoryScores };

    Object.entries(state.answers).forEach(([qId, score]) => {
      const question = questions.find(q => q.id === qId);
      if (question) {
        newCategoryScores[question.category] += score;
      }
    });

    // カテゴリごとに満点が異なる（50〜90点）ため、単純合計÷カテゴリ数ではなく、
    // 各カテゴリの達成率(%)を先に出してから平均する（実用書10章版付録の採点方式と一致）
    const categories = Object.keys(newCategoryScores) as Category[];
    const ratios = categories.map((cat) => newCategoryScores[cat] / maxScores[cat]);
    const avgRatio = ratios.reduce((sum, r) => sum + r, 0) / ratios.length;
    const finalTotal = Math.round(avgRatio * 100);

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
    // fetch()はHTTPエラー(404/429等)ではreject しないため、res.okを明示チェックしないと
    // エラーページ本文がCSVとして渡り、catch()のフォールバックが働かないまま読み込み中の
    // まま止まる可能性がある。利用者が増えた際にGoogle Sheetsの公開CSV書き出しが
    // レート制限等でエラーを返すケースに備えた防御。
    fetch(CSV_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error(`CSV fetch failed: ${res.status}`);
        }
        return res.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
             const itemsByCategory: Record<Category, AffiliateItem[]> = {
               organize: [], risk: [], finance: [], design: [], environment: [],
               capacity: [], society: [], lifeline: [], response: [], recovery: []
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

             // Google Sheet側のcategory列が古いカテゴリ名のままだったり空だったりすると、
             // そのカテゴリだけ商品が0件になり、ミッション画面に見出しだけ残って中身が
             // 空という壊れた見た目になる。シートから1件も取れなかったカテゴリは、
             // 同梱の静的データ（affiliateItems.ts）で補う。
             const merged = { ...itemsByCategory };
             (Object.keys(merged) as Category[]).forEach((cat) => {
               if (merged[cat].length === 0 && staticAffiliateItems[cat].length > 0) {
                 merged[cat] = staticAffiliateItems[cat];
               }
             });

             setState(prev => ({ ...prev, affiliateItems: merged }));
          }
        });
      })
      .catch(e => {
         console.error('Failed to load affiliate CSV:', e);
         // シート自体が読めない場合は、同梱の静的データをそのままフォールバックにする
         setState(prev => ({ ...prev, affiliateItems: staticAffiliateItems }));
      });
  }, []);

  const resetDiagnosis = () => {
    setState(prev => ({
      ...prev,
      answers: {},
      totalScore: 0,
      categoryScores: { ...emptyCategoryScores }
    }));
  };

  // ホーム画面から「前回の結果を見る」を選んだ際、診断をやり直さずに
  // localStorage履歴の最新1件をtotalScore/categoryScoresへ反映してResult画面へ渡す
  const loadLatestResult = () => {
    setState(prev => {
      if (prev.history.length === 0) return prev;
      const latest = prev.history[prev.history.length - 1];
      return {
        ...prev,
        totalScore: latest.totalScore,
        categoryScores: latest.categoryScores
      };
    });
  };

  return (
    <AppContext.Provider value={{ state, setProfile, setAnswer, calculateScores, resetDiagnosis, loadLatestResult }}>
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
