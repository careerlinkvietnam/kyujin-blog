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
  const articleId = 7720;

  // Read the improved content
  const newContent = fs.readFileSync('draft/overseas-salary-improved.html', 'utf8');

  console.log('Updating article ID:', articleId);
  console.log('New content length:', newContent.length, 'characters');

  // Update the article
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
      console.log('SUCCESS: Article updated');
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

updateArticle();
