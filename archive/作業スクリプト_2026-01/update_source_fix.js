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

async function updateArticle(articleId, filePath, description) {
  const content = fs.readFileSync(filePath, 'utf8');

  const articleData = JSON.stringify({
    content: content
  });

  console.log(`\n--- ${description} ---`);
  console.log('Article ID:', articleId);
  console.log('Content length:', content.length, 'characters');

  const postOptions = {
    hostname: 'kyujin.careerlink.asia',
    path: `/blog/wp-json/wp/v2/posts/${articleId}`,
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(articleData)
    }
  };

  try {
    const result = await makeRequest(postOptions, articleData);
    if (result.status === 200) {
      console.log('SUCCESS: Article updated');
      console.log('URL:', result.data.link);
    } else {
      console.log('ERROR: Status', result.status);
      console.log('Response:', JSON.stringify(result.data, null, 2));
    }
  } catch (e) {
    console.log('ERROR:', e.message);
  }
}

async function main() {
  console.log('=== Fixing source references (consulting company -> government sources) ===\n');

  // Update Thailand minimum wage article (ID: 7997)
  await updateArticle(
    7997,
    'draft/thailand-minimum-wage-labor-law-2025.html',
    'タイ最低賃金・労働法ガイド - 出典修正'
  );

  // Update women overseas job article (ID: 7698)
  await updateArticle(
    7698,
    'draft/women-overseas-job-improved.html',
    '女性の海外転職ガイド - 出典修正'
  );

  console.log('\n=== Done ===');
}

main();
