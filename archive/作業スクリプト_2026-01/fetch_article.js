const https = require('https');
const fs = require('fs');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const articleId = process.argv[2] || 7735;

const options = {
  hostname: 'kyujin.careerlink.asia',
  path: `/blog/wp-json/wp/v2/posts/${articleId}`,
  method: 'GET',
  headers: { 'Authorization': AUTH }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const article = JSON.parse(data);
    const date = new Date().toISOString().split('T')[0];
    const filename = `backups/articles/article_${articleId}_${date}.json`;
    fs.writeFileSync(filename, JSON.stringify(article, null, 2));
    console.log('Article saved to:', filename);
    console.log('Title:', article.title?.rendered);
    console.log('Content length:', article.content?.rendered?.length);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.end();
