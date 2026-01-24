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
  const articleId = 8009;
  const newContent = fs.readFileSync('draft/thailand-eec-investment-guide-2025.html', 'utf8');

  console.log('=== Updating Article ID:', articleId, '===');
  console.log('Content length:', newContent.length, 'characters');

  const updateData = JSON.stringify({
    content: newContent
  });

  const putOptions = {
    hostname: 'kyujin.careerlink.asia',
    path: `/blog/wp-json/wp/v2/posts/${articleId}`,
    method: 'PUT',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(updateData)
    }
  };

  try {
    const result = await makeRequest(putOptions, updateData);
    if (result.status === 200) {
      console.log('\n=== SUCCESS ===');
      console.log('Title:', result.data.title?.rendered);
      console.log('URL:', result.data.link);
      console.log('Modified:', result.data.modified);
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
