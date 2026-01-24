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
  const newTitle = '【2025-2026年版】タイ労働法ガイド｜人事・採用担当者向け完全解説';
  const newSlug = 'thailand-labor-law-employer-guide-2025';
  const newContent = fs.readFileSync('draft/thailand-labor-law-employer-guide-2025.html', 'utf8');

  console.log('=== Creating New Article ===');
  console.log('Title:', newTitle);
  console.log('Slug:', newSlug);
  console.log('Content length:', newContent.length, 'characters');

  const postData = JSON.stringify({
    title: newTitle,
    slug: newSlug,
    content: newContent,
    status: 'publish'
  });

  const postOptions = {
    hostname: 'kyujin.careerlink.asia',
    path: '/blog/wp-json/wp/v2/posts',
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  try {
    const result = await makeRequest(postOptions, postData);
    if (result.status === 201) {
      console.log('\n=== SUCCESS ===');
      console.log('New Article ID:', result.data.id);
      console.log('Title:', result.data.title?.rendered);
      console.log('Slug:', result.data.slug);
      console.log('URL:', result.data.link);
      console.log('Status:', result.data.status);
      console.log('Created:', result.data.date);
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

createArticle();
