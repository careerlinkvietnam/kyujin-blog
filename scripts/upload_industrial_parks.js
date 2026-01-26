const https = require('https');
const fs = require('fs');
const path = require('path');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const API_HOST = 'kyujin.careerlink.asia';

const articles = [
  { file: '07-1_ドンナイ省の工業団地ガイド_2026年版.md', title: 'ドンナイ省の工業団地ガイド【2026年最新版】' },
  { file: '07-2_ビンズオン省の工業団地ガイド_2026年版.md', title: 'ビンズオン省の工業団地ガイド【2026年最新版】' },
  { file: '07-3_バクニン省の工業団地ガイド_2026年版.md', title: 'バクニン省の工業団地ガイド【2026年最新版】' },
  { file: '07-4_ハイフォン市の工業団地ガイド_2026年版.md', title: 'ハイフォン市の工業団地ガイド【2026年最新版】' },
  { file: '07-5_ダナン市の工業団地ガイド_2026年版.md', title: 'ダナン市の工業団地ガイド【2026年最新版】' },
  { file: '07-6_ホーチミン市・ロンアン省の工業団地ガイド_2026年版.md', title: 'ホーチミン市・ロンアン省の工業団地ガイド【2026年最新版】' },
  { file: '07-7_ハノイ市・周辺省の工業団地ガイド_2026年版.md', title: 'ハノイ市・周辺省の工業団地ガイド【2026年最新版】' }
];

function markdownToHtml(markdown) {
  let html = markdown;
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');

  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const content = match.replace(/```\w*\n?/g, '').trim();
    return `<pre><code>${content}</code></pre>`;
  });

  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  let result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table><tbody>';
      }
      if (line.includes('---')) continue;
      const cells = line.split('|').filter(c => c.trim());
      const row = cells.map(c => `<td>${c.trim()}</td>`).join('');
      tableHtml += `<tr>${row}</tr>`;
    } else {
      if (inTable) {
        tableHtml += '</tbody></table>';
        result.push(tableHtml);
        inTable = false;
        tableHtml = '';
      }
      result.push(line);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table>';
    result.push(tableHtml);
  }

  html = result.join('\n');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table>)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<div)/g, '$1');
  html = html.replace(/(<\/div>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');

  return html;
}

function createArticle(article) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'blog_drafts', article.file);
    if (!fs.existsSync(filePath)) {
      console.log(`✗ ファイルが見つかりません: ${article.file}`);
      resolve({ success: false, error: 'File not found' });
      return;
    }

    const markdown = fs.readFileSync(filePath, 'utf-8');
    const htmlContent = markdownToHtml(markdown);

    const postData = JSON.stringify({
      title: article.title,
      content: htmlContent,
      status: 'draft'
    });

    const options = {
      hostname: API_HOST,
      path: '/blog/wp-json/wp/v2/posts',
      method: 'POST',
      headers: {
        'Authorization': AUTH,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.id) {
            console.log(`✓ ${article.file}`);
            console.log(`  ID: ${result.id}`);
            resolve({ success: true, id: result.id, title: article.title });
          } else {
            console.log(`✗ ${article.file}: ${result.message || 'Unknown error'}`);
            resolve({ success: false, error: result.message });
          }
        } catch (e) {
          console.log(`✗ ${article.file}: Parse error - ${e.message}`);
          resolve({ success: false, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      console.log(`✗ ${article.file}: Request error - ${e.message}`);
      resolve({ success: false, error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('=== 工業団地記事（07-1〜07-7）をWordPressドラフトにアップロード ===\n');

  const results = [];
  for (const article of articles) {
    const result = await createArticle(article);
    results.push(result);
    // APIレート制限対策で少し待機
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n=== 完了 ===');
  const success = results.filter(r => r.success).length;
  console.log(`成功: ${success}/${articles.length}`);
}

main();
