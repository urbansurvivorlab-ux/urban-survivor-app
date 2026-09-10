import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { questions } from '../data/questions';
import { ProgressBar } from '../components/common/ProgressBar';
import { Card } from '../components/common/Card';
import { useAppContext } from '../context/AppContext';
import { getMaxScore, getPersonalizedHint, shouldAutoSkip } from '../utils/personalization';

const CATEGORY_NAMES: Record<string, string> = {
  organize: '組織体制',
  risk: 'リスクの把握',
  finance: '財政基盤',
  design: '都市開発・設計',
  environment: '自然の緩衝機能',
  capacity: '組織能力強化',
  society: '社会的能力',
  lifeline: 'インフラ強靭化',
  response: '効果的な災害対応',
  recovery: '復興の迅速化',
};

const CATEGORY_ORDER = [
  'organize',
  'risk',
  'finance',
  'design',
  'environment',
  'capacity',
  'society',
  'lifeline',
  'response',
  'recovery'
];

export const Diagnosis: React.FC = () => {
  const navigate = useNavigate();
  const { state, setAnswer, calculateScores } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { profile } = state;

  // 世帯情報から見て明らかに「該当なし」の設問（子ども・ペット）は自動で満点にして出題から外す
  const skippedQuestions = useMemo(
    () => questions.filter((q) => shouldAutoSkip(q, profile)),
    [profile]
  );
  const activeQuestions = useMemo(
    () => questions.filter((q) => !shouldAutoSkip(q, profile)),
    [profile]
  );

  useEffect(() => {
    skippedQuestions.forEach((q) => setAnswer(q.id, getMaxScore(q)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skippedQuestions]);

  const question = activeQuestions[currentIndex];
  const progress = (currentIndex / activeQuestions.length) * 100;

  const categoryIndex = CATEGORY_ORDER.indexOf(question.category) + 1;
  const categoryName = CATEGORY_NAMES[question.category] || '';
  const personalizedHint = getPersonalizedHint(question, profile);

  const handleAnswer = (score: number) => {
    // Contextに回答を保存
    setAnswer(question.id, score);

    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 最後の質問の場合、スコアを計算して結果画面へ
      calculateScores();
      navigate('/result');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="py-6 min-h-[70vh] flex flex-col pt-12 animate-fade-in relative">
      <div className="mb-8 relative z-10 w-full max-w-xl mx-auto">
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 text-survivor-muted hover:text-white text-sm font-medium mb-3 transition-colors"
          >
            <ChevronLeft size={16} />
            前の質問に戻る
          </button>
        )}
        <div className="flex justify-between text-survivor-muted text-sm mb-2 font-medium">
          <span>{categoryName} カテゴリ {categoryIndex} / 10</span>
          <span>{currentIndex + 1} / {activeQuestions.length}</span>
        </div>
        <ProgressBar progress={progress} color="primary" height="h-2" />
      </div>

      <div className="flex-grow flex flex-col justify-center items-center w-full max-w-xl mx-auto relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-left text-white mb-4 leading-relaxed px-4">
          Q. {question.text}
        </h2>

        {personalizedHint && (
          <p className="text-sm text-survivor-primary font-medium text-center mb-6 px-4">
            {personalizedHint}
          </p>
        )}

        <div className={`w-full space-y-3 ${personalizedHint ? '' : 'mt-6'}`}>
          {question.options.map((option, idx) => (
            <Card
              key={idx}
              hoverable
              onClick={() => handleAnswer(option.score)}
              className="py-5 px-6 group border-white/10 hover:border-survivor-primary/50 transition-all flex justify-between items-center"
            >
              <span className="text-white font-medium text-lg">{option.label}</span>
              <div className="w-6 h-6 rounded-full border-2 border-white/20 group-hover:border-survivor-primary flex items-center justify-center transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-survivor-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Background glow specific to category */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-survivor-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
};
