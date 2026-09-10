import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Service WorkerがskipWaiting/clientsClaimで新バージョンに切り替わっても、
// 既に開いている画面のJS/CSSはそのまま古いものが動き続ける（ページ遷移や
// 再読み込みが無いと更新に気づけない）。ホーム画面から起動するPWAは
// 完全に閉じ直されないまま使われ続けることが多く、デプロイした修正が
// 反映されないまま表示され続ける原因になっていた。新しいSWが制御を
// 引き継いだ（controllerchange）瞬間に一度だけ自動でリロードする。
if ('serviceWorker' in navigator) {
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
