const fs = require('fs');

async function checkUrls() {
  const content = fs.readFileSync('src/data/officialLinks.ts', 'utf8');
  // 簡易的な正規表現でURL抽出
  const matches = [...content.matchAll(/url:\s*"([^"]+)"/g)];
  const urls = matches.map(m => m[1]);

  console.log(`Checking ${urls.length} URLs...`);
  
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        console.log(`[OK] ${res.status} ${url}`);
      } else {
        // Retry with GET
        const resGet = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (resGet.ok) {
           console.log(`[OK] ${resGet.status} ${url}`);
        } else {
           console.log(`[FAIL] ${resGet.status} ${url}`);
        }
      }
    } catch(e) {
      console.log(`[ERROR] ${url} : ${e.message}`);
    }
  }
}

checkUrls();
