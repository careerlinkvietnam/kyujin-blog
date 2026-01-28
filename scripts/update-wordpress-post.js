const https = require('https');
const fs = require('fs');

// Read the HTML content
const content = fs.readFileSync('C:\\Users\\siank\\Desktop\\ClaueCode\\drafts\\indonesia-living-cost-guide-2026.html', 'utf8');

const postId = 9256;

const data = JSON.stringify({
  content: content
});

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const options = {
  hostname: 'kyujin.careerlink.asia',
  port: 443,
  path: `/blog/wp-json/wp/v2/posts/${postId}`,
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
