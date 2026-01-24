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
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse: ' + data.substring(0, 100)));
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function updateYear(articleId) {
  const getOptions = {
    hostname: 'kyujin.careerlink.asia',
    path: `/blog/wp-json/wp/v2/posts/${articleId}`,
    method: 'GET',
    headers: { 'Authorization': AUTH }
  };

  const article = await makeRequest(getOptions);
  const oldTitle = article.title.rendered;

  // Skip if already 2026
  if (oldTitle.includes('2026')) {
    console.log(`SKIP: ${articleId} - Already 2026`);
    return;
  }

  // Backup
  fs.writeFileSync(`backups/articles/article_${articleId}_pre_year_update.json`, JSON.stringify(article, null, 2));

  // Update title and content
  const newTitle = oldTitle.replace(/2024/g, '2026').replace(/2025/g, '2026');
  let newContent = article.content.rendered
    .replace(/2024年(\d+)月時点/g, '2026年1月時点')
    .replace(/2024年(\d+)月/g, '2026年1月')
    .replace(/2024年時点/g, '2026年時点')
    .replace(/2025年(\d+)月時点/g, '2026年1月時点')
    .replace(/2025年(\d+)月/g, '2026年1月')
    .replace(/2025年時点/g, '2026年時点')
    .replace(/\(2024年\)/g, '(2026年)')
    .replace(/\(2025年\)/g, '(2026年)')
    .replace(/［2024/g, '［2026')
    .replace(/\[2024/g, '[2026');

  const updateData = JSON.stringify({ title: newTitle, content: newContent });
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

  const result = await makeRequest(putOptions, updateData);
  console.log(`DONE: ${articleId}`);
  console.log(`  OLD: ${oldTitle.substring(0, 50)}`);
  console.log(`  NEW: ${result.title.rendered.substring(0, 50)}`);
}

const articleIds = process.argv.slice(2).map(Number);
if (articleIds.length === 0) {
  console.log('Usage: node update_year_batch.js <id1> <id2> ...');
  process.exit(1);
}

(async () => {
  for (const id of articleIds) {
    try {
      await updateYear(id);
    } catch (e) {
      console.log(`ERROR: ${id} - ${e.message}`);
    }
  }
  console.log('--- All done ---');
})();
