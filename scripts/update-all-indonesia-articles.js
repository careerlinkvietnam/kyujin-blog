const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const articles = [
  { postId: 9261, file: 'indonesia-japanese-companies-ranking-2026.html', name: '日系企業ランキング' },
  { postId: 9262, file: 'indonesia-income-tax-guide-2026.html', name: '個人所得税ガイド' },
  { postId: 9263, file: 'indonesia-japanese-school-guide-2026.html', name: '日本人学校ガイド' },
  { postId: 9264, file: 'indonesia-international-school-guide-2026.html', name: 'インター校ガイド' },
  { postId: 9270, file: 'indonesia-visa-guide-2026.html', name: 'ビザガイド' }
];

async function updatePost(article) {
  return new Promise((resolve, reject) => {
    const content = fs.readFileSync(`C:\\Users\\siank\\Desktop\\ClaueCode\\drafts\\${article.file}`, 'utf8');

    const data = JSON.stringify({ content: content });

    const options = {
      hostname: 'kyujin.careerlink.asia',
      port: 443,
      path: `/blog/wp-json/wp/v2/posts/${article.postId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        console.log(`[${article.name}] Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log(`  -> Post ID ${article.postId} updated successfully`);
        } else {
          console.log(`  -> Error: ${responseData.substring(0, 200)}`);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`[${article.name}] Error:`, e.message);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== Updating Indonesia Articles ===\n');
  for (const article of articles) {
    await updatePost(article);
  }
  console.log('\n=== All updates complete ===');
}

main();
