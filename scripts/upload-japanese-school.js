const https = require('https');
const fs = require('fs');

// Read the HTML content
const content = fs.readFileSync('C:\\Users\\siank\\Desktop\\ClaueCode\\drafts\\indonesia-japanese-school-guide-2026.html', 'utf8');

const data = JSON.stringify({
  title: 'インドネシアの日本人学校ガイド【2026年最新】JJS・SJSの学費・入学情報',
  slug: 'indonesia-japanese-school-guide',
  status: 'draft',
  categories: [373, 28], // Indonesia, 生活情報
  content: content
});

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const options = {
  hostname: 'kyujin.careerlink.asia',
  port: 443,
  path: '/blog/wp-json/wp/v2/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`,
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(responseData);
      console.log('Post ID:', json.id);
      console.log('Title:', json.title?.rendered);
      console.log('Status:', json.status);
      console.log('Slug:', json.slug);
      console.log('Link:', json.link);
    } catch (e) {
      console.log('Response:', responseData.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
