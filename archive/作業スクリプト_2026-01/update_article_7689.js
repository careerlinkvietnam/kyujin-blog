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

async function updateArticle() {
  const newContent = fs.readFileSync('draft/overseas-job-no-english-guide-2026.html', 'utf8');

  console.log('=== Updating Article 7689: 英語なしでも海外転職 ===');
  console.log('Content length:', newContent.length, 'characters');
  console.log('Text length:', newContent.replace(/<[^>]*>/g, '').length, 'characters');

  const postData = JSON.stringify({
    title: '英語ができなくても海外転職は可能！2026年版完全ガイド【国別・職種別・成功事例】',
    content: newContent,
    status: 'publish',
    categories: [148]  // ビジネス(148)
  });

  const postOptions = {
    hostname: 'kyujin.careerlink.asia',
    path: '/blog/wp-json/wp/v2/posts/7689',
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  try {
    const result = await makeRequest(postOptions, postData);
    if (result.status === 200) {
      console.log('\n=== SUCCESS ===');
      console.log('Article ID:', result.data.id);
      console.log('Title:', result.data.title?.rendered);
      console.log('URL:', result.data.link);
      console.log('Status:', result.data.status);
      console.log('Categories:', result.data.categories);
    } else {
      console.log('\n=== ERROR ===');
      console.log('Status:', result.status);
      console.log('Response:', JSON.stringify(result.data, null, 2));
    }
  } catch (e) {
    console.log('\n=== ERROR ===');
    console.log(e.message);
  }
}

updateArticle();
