import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ChevronLeft, ShieldAlert, ChevronRight, HeartHandshake, Info } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAppContext } from '../context/AppContext';
import { calculateWeakPoints } from '../utils/scoreCalculator';
import { officialLinks } from '../data/officialLinks';

export const Mission: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { categoryScores, affiliateItems } = state;

  const weakPoints = calculateWeakPoints(categoryScores);

  // アフィリエイトタグ
  const affiliateTag = "urbansurviv07-22";

  // 個別商品ページ（/dp/ASIN）は廃盤・在庫切れでリンク切れになりやすいため、
  // Amazon公式の「検索結果ページへのリンク」機能（/s?k=キーワード&tag=...）を使う。
  // 同じ24時間の追跡クッキーが働き、対象商品が売り切れても検索結果自体は常に表示されるため壊れない。
  const getAmazonUrl = (keyword: string) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}&tag=${affiliateTag}`;

  return (
    <div className="py-6 animate-fade-in pb-20">
      <div className="mb-8 pl-2">
        <h2 className="text-2xl font-bold text-white mb-2">改善への道標</h2>
        <p className="text-survivor-muted text-sm">あなたの最優先弱点に基づき、今すぐできる行動を提案します。</p>
      </div>

      {/* Weakness Summary Card */}
      <div className="space-y-3 mb-10">
        <Card className="p-6 border-survivor-accent/30 bg-survivor-accent/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-survivor-accent/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-3 bg-survivor-accent/20 rounded-full text-survivor-accent">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 leading-tight text-white">
                {weakPoints.length > 0 ? `発見された弱点（全${weakPoints.length}カテゴリ）の補強` : '完璧な備えです！さらに強固な防衛を'}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {weakPoints.length > 0
                  ? `診断の結果、早急な対策が必要な弱点カテゴリが${weakPoints.length}つ見つかりました。都市災害において致命傷となり得るこれらの分野を直ちに補強するための専用装備リストを生成しました。`
                  : '弱点が見当たりません！より高度な防災キットを揃えてさらなる安全性を追求しましょう。'}
              </p>
            </div>
          </div>
        </Card>

        {/* モラロジー的な一言：まず自分の家族、その上で地域へ */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
          <HeartHandshake className="w-5 h-5 text-survivor-primary shrink-0 mt-0.5" />
          <p className="text-sm text-gray-400 leading-relaxed">
            まずは自分の家族の分を確保すること。その上で余力があれば、備えを地域と分け合うことも、いざという時の助け合いにつながります。
          </p>
        </div>

        {/* アフィリエイト開示（景品表示法のステルスマーケティング規制対応） */}
        <div className="flex items-start gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-500 leading-relaxed">
            以下の商品リンクはAmazon.co.jpの商品ページへのリンクです（2026-09-12時点、アソシエイト提携は行っておらず、購入いただいても紹介料は発生しません）。
          </p>
        </div>

        {/* Action Missions based on All Weaknesses */}
        <div className="space-y-8">
          {!affiliateItems ? (
             <div className="flex flex-col items-center justify-center p-12 space-y-4">
               <div className="w-8 h-8 rounded-full border-4 border-survivor-accent border-t-transparent animate-spin"></div>
               <p className="text-gray-400 font-bold animate-pulse">最新の防衛装備リストを本部（スプレッドシート）から受信中...</p>
             </div>
          ) : weakPoints.length > 0 && !weakPoints.some(wp => affiliateItems[wp.name].length > 0) ? (
            <div className="text-gray-400 text-sm p-4 text-center border border-white/5 rounded-xl bg-[#1e293b]/30">
              現在この弱点カテゴリに対応する推奨装備は準備中です。下記の公式情報も参考にしてください。
            </div>
          ) : weakPoints.length > 0 ? (
            weakPoints.filter(wp => affiliateItems[wp.name].length > 0).map(wp => (
              <div key={wp.name} className="space-y-3">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-survivor-accent/20">
                  <h3 className="font-bold text-lg text-white">【{wp.label}】の推奨防衛装備</h3>
                  <span className="bg-survivor-primary text-gray-900 text-xs font-bold px-2 py-0.5 rounded">即時実行推奨</span>
                </div>
                {affiliateItems[wp.name].map(item => (
            <Card key={item.id} className="p-5 overflow-hidden group">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-white text-lg leading-tight group-hover:text-survivor-primary transition-colors">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-center shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <a 
                    href={getAmazonUrl(item.name)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="primary" className="py-2.5 w-full whitespace-nowrap md:w-auto shadow-[0_0_15px_rgba(246,224,94,0.3)] hover:shadow-[0_0_20px_rgba(246,224,94,0.5)]">
                      <span className="font-bold">Amazonで確認</span>
                      <ExternalLink className="w-4 h-4 ml-1.5 opacity-80" />
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
                ))}
              </div>
            ))
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-survivor-accent/20">
                <h3 className="font-bold text-lg text-white">総合的な避難セットの確保</h3>
                <span className="bg-survivor-primary text-gray-900 text-xs font-bold px-2 py-0.5 rounded">即時実行推奨</span>
              </div>
              {(affiliateItems.lifeline || []).map(item => (
                <Card key={item.id} className="p-5 overflow-hidden group">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-white text-lg leading-tight group-hover:text-survivor-primary transition-colors">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center shrink-0 w-full md:w-auto mt-4 md:mt-0">
                      <a 
                        href={getAmazonUrl(item.name)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button variant="primary" className="py-2.5 w-full whitespace-nowrap md:w-auto shadow-[0_0_15px_rgba(246,224,94,0.3)] hover:shadow-[0_0_20px_rgba(246,224,94,0.5)]">
                          <span className="font-bold">Amazonで確認</span>
                          <ExternalLink className="w-4 h-4 ml-1.5 opacity-80" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Articles Section (Official Links based on Weaknesses) */}
      <div className="space-y-3 mt-12 mb-8">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-survivor-accent/20">
          <h3 className="font-bold text-lg text-white">直ちに必要な公式防衛知識</h3>
          <span className="bg-survivor-accent text-gray-900 text-xs font-bold px-2 py-0.5 rounded">MUST READ</span>
        </div>
        <div className="flex flex-col gap-3">
          {weakPoints.length > 0 ? (
            weakPoints.map(wp => (
              officialLinks[wp.name].map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-[#1e293b]/50 border border-white/5 hover:border-survivor-primary/30 hover:bg-[#1e293b] transition-all group">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-xs font-medium text-survivor-accent">{link.source}</span>
                    <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{link.title}</span>
                    <span className="text-sm text-gray-400 mt-1 leading-relaxed">{link.description}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0 text-gray-500 group-hover:text-survivor-primary transition-colors" />
                </a>
              ))
            ))
          ) : (
            <div className="text-gray-400 text-sm p-4 text-center border border-white/5 rounded-xl bg-[#1e293b]/30">
              完璧な備えです。さらに高度な情報は、各専門機関の公式サイト等を引き続きご確認ください。
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <Button variant="secondary" onClick={() => navigate('/')} className="px-8">
          <ChevronLeft size={20} />
          トップへ戻る
        </Button>
      </div>
    </div>
  );
};
