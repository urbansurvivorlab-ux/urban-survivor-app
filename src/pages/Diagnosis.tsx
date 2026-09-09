import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { ProgressBar } from '../components/common/ProgressBar';
import { Card } from '../components/common/Card';
import { useAppContext } from '../context/AppContext';

const CATEGORY_NAMES: Record<string, string> = {
  infrastructure: '物理的安全性・インフラ',
  stockpile: '物資供給・兵站',
  communication: '情報通信・状況把握',
  evacuation: '避難行動・装備',
  governance: '社会的配慮・ガバナンス',
};

const CATEGORY_ORDER = [
  'infrastructure',
  'stockpile',
  'communication',
  'evacuation',
  'governance'
];

export const Diagnosis: React.FC = () => {
  const navigate = useNavigate();
  const { setAnswer, calculateScores } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const question = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const categoryIndex = CATEGORY_ORDER.indexOf(question.category) + 1;
  const categoryName = CATEGORY_NAMES[question.category] || '';

  const handleAnswer = (score: number) => {
    // Contextに回答を保存
    setAnswer(question.id, score);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 最後の質問の場合、スコアを計算して結果画面へ
      calculateScores();
      navigate('/result');
    }
  };

  return (
    <div className="py-6 min-h-[70vh] flex flex-col pt-12 animate-fade-in relative">
      <div className="mb-8 relative z-10 w-full max-w-xl mx-auto">
        <div className="flex justify-between text-survivor-muted text-sm mb-2 font-medium">
          <span>{categoryName} カテゴリ {categoryIndex} / 5</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <ProgressBar progress={progress} color="primary" height="h-2" />
      </div>

      <div className="flex-grow flex flex-col justify-center items-center w-full max-w-xl mx-auto relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10 leading-relaxed px-4">
          Q. {question.text}
        </h2>

        <div className="w-full space-y-3">
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
