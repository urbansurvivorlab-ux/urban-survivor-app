import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Activity, AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 animate-fade-in relative">
      
      {/* Hero Section */}
      <div className="text-center mb-12 relative z-10 w-full">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-survivor-primary/20 blur-2xl rounded-full scale-150" />
            <img src="/logo.png" alt="Urban Survivor Certified Logo" className="w-32 h-32 relative z-10 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] object-contain rounded-full" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          都市型サバイバー
        </h1>
        <p className="text-xl md:text-2xl font-medium text-survivor-primary mb-6 tracking-wide drop-shadow-md">
          家庭防災スコアカード
        </p>
        
        <p className="text-survivor-muted max-w-lg mx-auto text-sm md:text-base leading-relaxed mb-10">
          止まった都市は、嘘をつかない。<br />
          持っている者と、持っていない者を、<br />
          静かに、残酷に、選り分ける。
        </p>
        
        <Button 
          variant="primary" 
          className="text-lg py-4 px-10 rounded-full w-full sm:w-auto mx-auto max-w-xs animate-pulse-glow"
          onClick={() => navigate('/profile')}
        >
          <span className="font-extrabold">診断スタート</span>
          <ChevronRight size={24} />
        </Button>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl relative z-10 mt-8">
        <Card className="flex flex-col items-center text-center group cursor-default">
          <div className="bg-white/5 p-3 rounded-full mb-4 group-hover:bg-survivor-primary/20 transition-colors">
            <Activity size={28} className="text-survivor-primary" />
          </div>
          <h3 className="font-bold text-white mb-2">可視化する</h3>
          <p className="text-xs text-survivor-muted">6つのカテゴリであなたの生存能力を数値化します。</p>
        </Card>
        
        <Card className="flex flex-col items-center text-center group cursor-default">
          <div className="bg-white/5 p-3 rounded-full mb-4 group-hover:bg-survivor-accent/20 transition-colors">
            <AlertTriangle size={28} className="text-survivor-accent" />
          </div>
          <h3 className="font-bold text-white mb-2">弱点を知る</h3>
          <p className="text-xs text-survivor-muted">何が足りないのか、致命的な弱点を明らかにします。</p>
        </Card>
        
        <Card className="flex flex-col items-center text-center group cursor-default">
          <div className="bg-white/5 p-3 rounded-full mb-4 group-hover:bg-green-500/20 transition-colors">
            <BookOpen size={28} className="text-green-500" />
          </div>
          <h3 className="font-bold text-white mb-2">知識を得る</h3>
          <p className="text-xs text-survivor-muted">弱点にもとづき、具体的な行動ミッションと記事を提示します。</p>
        </Card>
      </div>
      
    </div>
  );
};
