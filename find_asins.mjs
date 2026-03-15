import https from 'https';

const keywords = [
  "自衛隊防災BOOK",
  "エマージェンシーホイッスル",
  "家庭用 ホワイトボード",
  "救急セット ファーストエイド",
  "サバイバルシート 防寒",
  "SAKUTTO 携帯浄水器",
  "家具転倒防止 突っ張り棒",
  "ガラス飛散防止フィルム 防災",
  "住宅用消火器 蓄圧式",
  "カセットコンロ イワタニ",
  "簡易トイレ BOS 50回",
  "ポータブル電源 Jackery",
  "耐火 防水 金庫 小型",
  "ドキュメントスタンド 持ち運び",
  "セキュリティポーチ 薄型",
  "防災ラジオ 手回し ソーラー",
  "LEDランタン 防災 電池式",
  "バール 鍛造 救助"
];

async function searchAmazon(keyword) {
  const url = `https://search.yahoo.co.jp/search?p=site:amazon.co.jp/dp/+${encodeURIComponent(keyword)}`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...data.matchAll(/amazon\.co\.jp\/(?:(?:[^\/]+\/)?dp|gp\/product)\/([A-Z0-9]{10})/g)];
        if (matches.length > 0) {
          // get the most frequent ASIN
          const counts = {};
          matches.forEach(m => { counts[m[1]] = (counts[m[1]] || 0) + 1; });
          const best = Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
          resolve(best);
        } else {
          resolve(null);
        }
      });
    });
  });
}

(async () => {
  for (const kw of keywords) {
    const asin = await searchAmazon(kw);
    console.log(`[${asin || 'NOT_FOUND'}] ${kw}`);
    // sleep to prevent blocking
    await new Promise(r => setTimeout(r, 1000));
  }
})();
