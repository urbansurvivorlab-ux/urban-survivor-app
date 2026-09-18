import React, { useEffect, useState } from 'react';
import { Mail, Bell, BellOff, Loader2, Check } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const STORAGE_KEY = 'survivor_reminder';

interface StoredSubscription {
  email: string;
  manageToken: string;
  active: boolean;
}

function loadSubscription(): StoredSubscription | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSubscription) : null;
  } catch {
    return null;
  }
}

function saveSubscription(sub: StoredSubscription) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
}

// 診断結果画面に置く「半年ごとの再診断リマインド」の任意登録カード。
// 登録はあくまでオプトイン——このカードを無視しても診断自体は今まで通り無料・登録不要で使える。
export const ReminderSignup: React.FC = () => {
  const [subscription, setSubscription] = useState<StoredSubscription | null>(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    setSubscription(loadSubscription());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setStatus('error');
      setErrorMessage('同意のチェックを入れてください');
      return;
    }
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/reminder-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '登録に失敗しました');

      const sub: StoredSubscription = { email, manageToken: data.manageToken, active: true };
      saveSubscription(sub);
      setSubscription(sub);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : '登録に失敗しました');
    }
  };

  const handleToggle = async () => {
    if (!subscription) return;
    setToggling(true);
    try {
      const res = await fetch(
        `/api/reminder-manage?token=${subscription.manageToken}&action=toggle`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = { ...subscription, active: data.active as boolean };
      saveSubscription(updated);
      setSubscription(updated);
    } catch {
      // 通信エラー時は状態を変えず、そのままにする（次回操作で再試行できる）
    } finally {
      setToggling(false);
    }
  };

  // すでにこの端末で登録済み：オン/オフの状態表示＋トグル
  if (subscription) {
    return (
      <Card className="max-w-md mx-auto mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-survivor-primary/10 rounded-full text-survivor-primary shrink-0">
            {subscription.active ? <Bell size={20} /> : <BellOff size={20} />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white mb-0.5">半年ごとの再診断リマインド</h4>
            <p className="text-xs text-gray-400">
              {subscription.active
                ? `${subscription.email} 宛に配信中`
                : '配信は停止しています'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            aria-label="リマインド配信の切り替え"
            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
              subscription.active ? 'bg-survivor-primary' : 'bg-white/10'
            } disabled:opacity-50`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                subscription.active ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </Card>
    );
  }

  // 未登録：メール入力フォーム（完全に任意・スキップしても診断機能には影響しない）
  return (
    <Card className="max-w-md mx-auto mb-8">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-survivor-primary/10 rounded-full text-survivor-primary shrink-0">
          <Mail size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white mb-1">半年後、もう一度チェックしませんか？</h4>
          <p className="text-sm text-gray-400 leading-relaxed mb-3">
            備えは一度整えて終わりではなく、回し続けるもの。約6ヶ月ごとに再診断をおすすめするメールをお送りします（任意・いつでもオフにできます）。
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-survivor-primary transition-colors"
            />
            <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5"
              />
              <span>約6ヶ月ごとにリマインドメールを受け取ることに同意します（配信はいつでも停止できます）</span>
            </label>
            {status === 'error' && (
              <p className="text-xs text-red-400">{errorMessage}</p>
            )}
            <Button type="submit" variant="outline" fullWidth disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm font-medium">登録中...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span className="text-sm font-medium">リマインドを登録する</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
};
