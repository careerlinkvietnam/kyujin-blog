const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const content = fs.readFileSync('C:\\Users\\siank\\Desktop\\ClaueCode\\drafts\\indonesia-visa-guide-2026.html', 'utf8');

const postData = JSON.stringify({
  title: 'インドネシアのビザガイド【2026年最新】就労・投資・リタイアメントビザを徹底解説',
  content: content,
  status: 'draft',
  categories: [373, 28], // Indonesia, 生活情報
  meta: {
    _yoast_wpseo_metadesc: 'インドネシアのビザを徹底解説。VOA（到着ビザ）、就労KITAS、投資家ビザ、リタイアメントビザ、デジタルノマドビザ（E33G）の要件・費用・申請方法を、入国管理局の公式情報に基づき2026年最新版でご紹介します。'
  }
});

const options = {
  hostname: 'kyujin.careerlink.asia',
  port: 443,
  path: '/blog/wp-json/wp/v2/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${auth}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 201) {
      const response = JSON.parse(data);
      console.log('Post created successfully!');
      console.log('Post ID:', response.id);
      console.log('Edit URL:', response.link.replace('kyujin.careerlink.asia/blog/', 'kyujin.careerlink.asia/blog/wp-admin/post.php?post=' + response.id + '&action=edit'));
    } else {
      console.log('Error:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(postData);
req.end();
