import fs from 'fs';

let content = fs.readFileSync('src/data/affiliateItems.ts', 'utf8');

// The ASINs that were verified via Web Search.
const replacements = {
  'B000FIZY1S': 'B000FVRGSI',
  'B00CD2061A': 'B0CBB1P52J',
  'B08R97F3G8': 'B0BNSQ71KD',
  'B071LPL67M': 'B0GFCH8WXK',
  'B0892B1H5X': 'B00FA2RLX2',
  'B000TQ8ZZ4': 'B0B87BKGFK',
  'B001TUUTP8': 'B0033W1SDK',
  'B00I3YQXYK': 'B0922HK882',
  'B004XBEW8S': 'B01J59SGCK',
  'B07TS2B799': 'B0CGGWG8F4',
  'B09WMR5FCL': 'B0GQ9DHMR1',
  'B01D2D6QYK': 'B0D731S543',
  'B07P47K6XJ': 'B0D8GHQWZR',
  'B0892BTVT3': 'B0GRZBTRB7',
  'B0B8YRDJ8N': 'B0751B8XQB',
  'B016922ZAY': 'B0D3DLL7NP'
};

for (const [oldAsin, newAsin] of Object.entries(replacements)) {
  content = content.replace(new RegExp(\`asin:\\\\s*['\"]\${oldAsin}['\"]\`, 'g'), \`asin: "\${newAsin}"\`);
}

fs.writeFileSync('src/data/affiliateItems.ts', content, 'utf8');
console.log('Done replacing ASINs in affiliateItems.ts.');
