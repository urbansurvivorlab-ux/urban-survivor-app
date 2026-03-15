const fs = require('fs');
let s = fs.readFileSync('src/data/affiliateItems.ts', 'utf8');
s = s.replace(/,\s*priceEstimate:\s*["'].*?["']/g, '');
fs.writeFileSync('src/data/affiliateItems.ts', s, 'utf8');
