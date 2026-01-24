const https = require('https');
const fs = require('fs');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// CTA templates by country
const CTA_TEMPLATES = {
  vietnam: `
<div style="background-color: #f0f8ff; border: 2px solid #1e90ff; border-radius: 10px; padding: 20px; margin: 30px 0;">
<h3 style="color: #1e90ff; margin-top: 0;">ベトナムで働くことに興味はありませんか？</h3>
<p>キャリアリンクアジアでは、ベトナム・ホーチミン・ハノイの日系企業の求人を多数掲載しています。ベトナムでの就職・転職をお考えの方は、ぜひご覧ください。</p>
<p><strong><a href="https://kyujin.careerlink.asia/vietnam/job/list" style="color: #1e90ff;">▶ ベトナムの求人一覧を見る</a></strong></p>
<p><strong><a href="https://kyujin.careerlink.asia/jobseeker/register" style="color: #1e90ff;">▶ 無料会員登録はこちら</a></strong></p>
</div>`,
  thailand: `
<div style="background-color: #f0f8ff; border: 2px solid #1e90ff; border-radius: 10px; padding: 20px; margin: 30px 0;">
<h3 style="color: #1e90ff; margin-top: 0;">タイで働くことに興味はありませんか？</h3>
<p>キャリアリンクアジアでは、タイ・バンコクの日系企業の求人を多数掲載しています。タイでの就職・転職をお考えの方は、ぜひご覧ください。</p>
<p><strong><a href="https://kyujin.careerlink.asia/thailand/job/list" style="color: #1e90ff;">▶ タイの求人一覧を見る</a></strong></p>
<p><strong><a href="https://kyujin.careerlink.asia/jobseeker/register" style="color: #1e90ff;">▶ 無料会員登録はこちら</a></strong></p>
</div>`,
  indonesia: `
<div style="background-color: #f0f8ff; border: 2px solid #1e90ff; border-radius: 10px; padding: 20px; margin: 30px 0;">
<h3 style="color: #1e90ff; margin-top: 0;">インドネシアで働くことに興味はありませんか？</h3>
<p>キャリアリンクアジアでは、インドネシア・ジャカルタの日系企業の求人を多数掲載しています。インドネシアでの就職・転職をお考えの方は、ぜひご覧ください。</p>
<p><strong><a href="https://kyujin.careerlink.asia/indonesia/job/list" style="color: #1e90ff;">▶ インドネシアの求人一覧を見る</a></strong></p>
<p><strong><a href="https://kyujin.careerlink.asia/jobseeker/register" style="color: #1e90ff;">▶ 無料会員登録はこちら</a></strong></p>
</div>`,
  sea: `
<div style="background-color: #f0f8ff; border: 2px solid #1e90ff; border-radius: 10px; padding: 20px; margin: 30px 0;">
<h3 style="color: #1e90ff; margin-top: 0;">東南アジアで働くことに興味はありませんか？</h3>
<p>キャリアリンクアジアでは、東南アジア各国の日系企業の求人を多数掲載しています。海外での就職・転職をお考えの方は、ぜひご覧ください。</p>
<p><strong><a href="https://kyujin.careerlink.asia/job/list" style="color: #1e90ff;">▶ 東南アジアの求人一覧を見る</a></strong></p>
<p><strong><a href="https://kyujin.careerlink.asia/jobseeker/register" style="color: #1e90ff;">▶ 無料会員登録はこちら</a></strong></p>
</div>`
};

function detectCountry(title) {
  title = title.toLowerCase();
  if (title.includes('ベトナム') || title.includes('ホーチミン') || title.includes('ハノイ') || title.includes('ダナン') || title.includes('フエ') || title.includes('ホイアン') || title.includes('ダラット') || title.includes('ニャチャン') || title.includes('フーコック')) {
    return 'vietnam';
  }
  if (title.includes('タイ') || title.includes('バンコク') || title.includes('チェンマイ') || title.includes('プーケット') || title.includes('パタヤ')) {
    return 'thailand';
  }
  if (title.includes('インドネシア') || title.includes('ジャカルタ') || title.includes('バリ')) {
    return 'indonesia';
  }
  return 'sea';
}

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse response: ' + data.substring(0, 200)));
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function addCTA(articleId) {
  // Get article
  const getOptions = {
    hostname: 'kyujin.careerlink.asia',
    path: `/blog/wp-json/wp/v2/posts/${articleId}`,
    method: 'GET',
    headers: { 'Authorization': AUTH }
  };

  const article = await makeRequest(getOptions);
  const title = article.title.rendered;
  const content = article.content.rendered;

  // Check if CTA already exists
  if (content.includes('kyujin.careerlink.asia') && content.includes('働くことに興味')) {
    console.log(`SKIP: ${articleId} - ${title.substring(0, 30)} (CTA already exists)`);
    return { status: 'skipped', reason: 'CTA already exists' };
  }

  // Backup
  const date = new Date().toISOString().split('T')[0];
  const backupPath = `backups/articles/article_${articleId}_${date}.json`;
  fs.writeFileSync(backupPath, JSON.stringify(article, null, 2));

  // Detect country and add CTA
  const country = detectCountry(title);
  const cta = CTA_TEMPLATES[country];
  const newContent = content + cta;

  // Update
  const updateData = JSON.stringify({ content: newContent });
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

  await makeRequest(putOptions, updateData);
  console.log(`DONE: ${articleId} - ${title.substring(0, 30)} (${country})`);
  return { status: 'done', country };
}

// Article IDs to process (lifestyle/travel articles)
const articleIds = process.argv.slice(2).map(Number);

if (articleIds.length === 0) {
  console.log('Usage: node add_cta_batch.js <id1> <id2> ...');
  process.exit(1);
}

(async () => {
  for (const id of articleIds) {
    try {
      await addCTA(id);
    } catch (e) {
      console.log(`ERROR: ${id} - ${e.message}`);
    }
  }
})();
