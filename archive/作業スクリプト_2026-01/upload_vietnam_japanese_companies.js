const https = require('https');
const fs = require('fs');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          reject(new Error('Failed to parse response: ' + data.substring(0, 500)));
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function createArticle() {
  const content = fs.readFileSync('draft/vietnam-japanese-companies-2026.html', 'utf8');

  const articleData = JSON.stringify({
    title: '【2026年版】ベトナム日系企業動向｜進出状況・業種別分析・転職市場',
    content: content,
    status: 'publish',
    slug: 'vietnam-japanese-companies-2026'
  });

  console.log('=== Creating new article: ベトナム日系企業動向2026 ===\n');
  console.log('Content length:', content.length, 'characters');

  const postOptions = {
    hostname: 'kyujin.careerlink.asia',
    path: '/blog/wp-json/wp/v2/posts',
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(articleData)
    }
  };

  try {
    const result = await makeRequest(postOptions, articleData);
    if (result.status === 201) {
      console.log('SUCCESS: Article created');
      console.log('ID:', result.data.id);
      console.log('URL:', result.data.link);
    } else {
      console.log('ERROR: Status', result.status);
      console.log('Response:', JSON.stringify(result.data, null, 2));
    }
  } catch (e) {
    console.log('ERROR:', e.message);
  }
}

createArticle();
