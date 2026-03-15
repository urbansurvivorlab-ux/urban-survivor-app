import https from 'https';

const keywords = [
  "消火器 蓄圧式 住宅",
  "バール 鍛造 450mm"
];

async function searchAmazon(keyword) {
  const url = `https://search.yahoo.co.jp/search?p=site:amazon.co.jp/dp/+${encodeURIComponent(keyword)}`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = [...data.matchAll(/amazon\.co\.jp\/(?:(?:[^\/]+\/)?dp|gp\/product)\/([A-Z0-9]{10})/g)];
        if (matches.length > 0) {
          resolve(matches[0][1]);
        } else {
          resolve('NOT_FOUND');
        }
      });
    });
  });
}

(async () => {
  for (const kw of keywords) {
    console.log(`[${await searchAmazon(kw)}] ${kw}`);
  }
})();
