import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { ChevronRight, AlertCircle, TrendingUp, Users2, Share2, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAppContext } from '../context/AppContext';
import { calculateWeakPoints, getLevelText, maxScores, categoryLabels } from '../utils/scoreCalculator';
import type { Category } from '../types';

const SHARE_URL = 'https://urban-survivor-app.vercel.app/';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { totalScore, categoryScores, history } = state;
  const [shared, setShared] = useState(false);

  const levelText = getLevelText(totalScore);
  const weakPoints = calculateWeakPoints(categoryScores);

  // 社会的能力（第7要素）の達成率が高い世帯には、家族だけでなく地域も守れる立場にあることを伝える
  const societyRatio = categoryScores.society / maxScores.society;

  const handleShare = async () => {
    const shareData = {
      title: '家庭防災スコアカード',
      text: `我が家の総合防衛力スコアは${totalScore}点でした。あなたの家はどのくらい備えられていますか？`,
      url: SHARE_URL
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // ユーザーがシェアをキャンセルした場合は何もしない
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // クリップボードにも失敗した場合は何もしない
      }
    }
  };

  // 履歴グラフ用のデータ整形 (直近5件を表示)
  const historyData = useMemo(() => {
    return history
      .slice(-5)
      .map(record => ({
        date: format(new Date(record.date), 'MM/dd'),
        score: record.totalScore
      }));
  }, [history]);

  // レーダーチャート用のデータ整形
  // カテゴリごとに満点（10〜90点）が異なるため、全軸を達成率（%）で統一して描画する
  const categoryOrder: Category[] = [
    'organize', 'risk', 'finance', 'design', 'environment',
    'capacity', 'society', 'lifeline', 'response', 'recovery'
  ];
  const data = categoryOrder.map((cat) => ({
    subject: categoryLabels[cat],
    score: Math.round((categoryScores[cat] / maxScores[cat]) * 100),
    fullMark: 100
  }));

  return (
    <div className="py-6 animate-fade-in relative">
      <div className="text-center mb-10">
        <div className="inline-flex bg-survivor-primary/10 p-2 rounded-full mb-4 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
          <img src="/logo.png" alt="Certified Badge" className="w-16 h-16 object-contain rounded-full" />
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-survivor-primary to-yellow-200 mb-2">
          {levelText}
        </h2>
        <div className="text-6xl font-black text-white mb-2 tracking-tighter shadow-survivor-primary/50 drop-shadow-lg">
          {totalScore} <span className="text-2xl text-survivor-muted font-bold">/ 100</span>
        </div>
        <p className="text-survivor-muted text-sm mb-4">現在の総合防衛力</p>
        <p className="text-sm font-medium italic text-gray-300">
          {totalScore >= 90 ? `「${totalScore}点。備えた父親が、家族を守る。」` :
           totalScore >= 70 ? `「${totalScore}点。この家族は、いざというときに動ける。」` :
           totalScore >= 50 ? `「${totalScore}点。備えは始まっている。あとは穴をふさぐだけだ。」` :
           totalScore >= 30 ? `「${totalScore}点。これが今日のあなたの出発点だ。」` :
           `「${totalScore}点。今日、あなたは現実を直視した。それが最初の一歩だ。」`}
        </p>
      </div>

      <Card className="max-w-md mx-auto mb-8 relative overflow-hidden">
        <h3 className="font-bold text-white mb-6 text-center">カテゴリ別スコア</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#ffffff33" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#F8FAFC', fontSize: 12, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar 
                name="Score" 
                dataKey="score" 
                stroke="#EAB308" 
                fill="#EAB308" 
                fillOpacity={0.4} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 弱点ハイライト */}
        <div className="mt-6 p-4 rounded-xl bg-survivor-accent/10 border border-survivor-accent/20">
          <div className="flex items-center gap-2 text-survivor-accent font-bold mb-3">
            <AlertCircle size={20} />
            <h4>最優先補強カテゴリ（弱点）</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {weakPoints.length > 0 ? (
              weakPoints.map(wp => (
                <div key={wp.name} className="px-3 py-1.5 rounded-lg bg-survivor-accent/20 text-red-200 text-sm font-medium border border-survivor-accent/30 flex items-center gap-1">
                  {wp.label} <span className="opacity-70 text-xs ml-1 font-normal">(達成率{Math.round(wp.ratio * 100)}%)</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-green-400 font-medium px-2">目立った弱点はありません。素晴らしい備えです！</div>
            )}
          </div>
        </div>

        {/* 社会的能力が高い世帯への一言（家族の備えが地域の備えにもつながることを伝える） */}
        {societyRatio >= 0.7 && (
          <div className="mt-4 p-4 rounded-xl bg-survivor-primary/10 border border-survivor-primary/20 flex items-start gap-3">
            <Users2 className="w-5 h-5 text-survivor-primary shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300 leading-relaxed">
              社会的能力の達成率{Math.round(societyRatio * 100)}%。あなたは自分の家族を守れるだけでなく、いざという時に近所や地域の誰かを助けられる側にいます。
            </p>
          </div>
        )}
      </Card>

      {/* History Chart */}
      {history.length > 1 && (
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-survivor-accent/10 rounded-full blur-3xl group-hover:bg-survivor-accent/20 transition-colors duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-survivor-accent" />
              <h3 className="font-bold text-lg text-white">サバイバル能力の推移</h3>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#A0AEC0" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#A0AEC0" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A202C', borderColor: '#2D3748', color: '#E2E8F0' }}
                    itemStyle={{ color: '#F6E05E' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="スコア" 
                    stroke="#F6E05E" 
                    strokeWidth={3}
                    dot={{ fill: '#1A202C', stroke: '#F6E05E', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#F6E05E' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}

      {/* Action Button */}
      <div className="flex flex-col gap-4 max-w-md mx-auto pb-10">
        <Button variant="danger" fullWidth onClick={() => navigate('/mission')} className="py-4">
          <span className="font-bold text-lg">緊急ミッションを確認する</span>
          <ChevronRight size={24} />
        </Button>
        <Button variant="outline" fullWidth onClick={handleShare} className="py-3">
          {shared ? (
            <>
              <Check size={18} />
              <span className="font-medium">コピーしました</span>
            </>
          ) : (
            <>
              <Share2 size={18} />
              <span className="font-medium">家族や友人にもすすめる</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
