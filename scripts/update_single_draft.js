const https = require('https');
const fs = require('fs');
const path = require('path');

// WordPress API設定
const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const API_HOST = 'kyujin.careerlink.asia';

// 更新対象
const articleId = 9211;  // シーロム・サラデーン ラーメンマップ
const articleFile = '16_バンコクのラーメンマップ_シーロム・サラデーン_2026年版.md';

// MarkdownをHTMLに変換（iframeはそのまま保持）
function markdownToHtml(markdown) {
  let html = markdown;

  // 見出し
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // 太字
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // リンク
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 引用
  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

  // 水平線
  html = html.replace(/^---$/gm, '<hr>');

  // リスト（箇条書き）
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');

  // テーブル（シンプルな変換）
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

  // 段落
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
  html = html.replace(/<p>(<iframe)/g, '$1');
  html = html.replace(/(<\/iframe>)<\/p>/g, '$1');

  return html;
}

// 記事を更新
function updateArticle() {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'blog_drafts', articleFile);

    if (!fs.existsSync(filePath)) {
      console.log(`ファイルが見つかりません: ${articleFile}`);
      resolve({ success: false, error: 'File not found' });
      return;
    }

    const markdown = fs.readFileSync(filePath, 'utf-8');
    const htmlContent = markdownToHtml(markdown);

    const postData = JSON.stringify({
      content: htmlContent
    });

    const options = {
      hostname: API_HOST,
      path: `/blog/wp-json/wp/v2/posts/${articleId}`,
      method: 'PUT',
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
            console.log(`✓ 更新成功: ID ${result.id}`);
            console.log(`  タイトル: ${result.title.rendered}`);
            console.log(`  URL: ${result.link}`);
            resolve({ success: true, id: result.id });
          } else {
            console.log(`✗ エラー: ${result.message || 'Unknown error'}`);
            resolve({ success: false, error: result.message });
          }
        } catch (e) {
          console.log(`✗ Parse error: ${e.message}`);
          resolve({ success: false, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      console.log(`✗ Request error: ${e.message}`);
      resolve({ success: false, error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

// メイン実行
async function main() {
  console.log('=== WordPressドラフト記事を更新（iframe地図付き）===\n');
  await updateArticle();
}

main();
