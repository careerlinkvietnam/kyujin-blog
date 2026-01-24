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
  const content = fs.readFileSync('draft/thailand-minimum-wage-labor-law-2025.html', 'utf8');

  const articleData = JSON.stringify({
    title: '【2025-2026年】タイ最低賃金・労働法改正ガイド｜日系企業の実務対応',
    content: content,
    status: 'publish',
    slug: 'thailand-minimum-wage-labor-law-2025',
    categories: [],
    tags: []
  });

  console.log('Creating new article...');
  console.log('Title: 【2025-2026年】タイ最低賃金・労働法改正ガイド｜日系企業の実務対応');
  console.log('Slug: thailand-minimum-wage-labor-law-2025');
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
      console.log('Article ID:', result.data.id);
      console.log('Title:', result.data.title?.rendered);
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
