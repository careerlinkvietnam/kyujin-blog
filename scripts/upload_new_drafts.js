const https = require('https');
const fs = require('fs');
const path = require('path');

// WordPress API設定
const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const API_HOST = 'kyujin.careerlink.asia';

// 新規作成する記事
const articlesToCreate = [
  {
    file: '12_ハノイの日本語対応会計事務所一覧_2026年版.md',
    title: 'ベトナム ハノイの日本語対応会計事務所一覧【2026年最新版】',
    country: 'vietnam'
  },
  {
    file: '13_ハノイと近郊のゴルフ場一覧_2026年版.md',
    title: 'ベトナム ハノイと近郊のゴルフ場一覧【2026年版】',
    country: 'vietnam'
  },
  {
    file: '14_ハノイの賃貸物件とオススメの不動産屋_2026年版.md',
    title: 'ベトナム ハノイの賃貸物件とオススメの不動産会社【2026年最新版】',
    country: 'vietnam'
  },
  {
    file: '15_バンコクのラーメンマップ_プロンポン・アソーク_2026年版.md',
    title: 'タイ バンコクのラーメンマップ【プロンポン・アソーク編】2026年版',
    country: 'thailand'
  },
  {
    file: '16_バンコクのラーメンマップ_シーロム・サラデーン_2026年版.md',
    title: 'タイ バンコクのラーメンマップ【シーロム・サラデーン編】2026年版',
    country: 'thailand'
  }
];

// MarkdownをシンプルなHTMLに変換
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
      // ヘッダー区切り行をスキップ
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

  return html;
}

// 記事を新規作成（ドラフトとして）
function createArticle(article) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'blog_drafts', article.file);

    if (!fs.existsSync(filePath)) {
      console.log(`ファイルが見つかりません: ${article.file}`);
      resolve({ success: false, file: article.file, error: 'File not found' });
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
            console.log(`✓ 作成成功: ${article.file}`);
            console.log(`  ID: ${result.id}`);
            console.log(`  タイトル: ${result.title.rendered}`);
            console.log(`  URL: ${result.link}`);
            resolve({ success: true, id: result.id, file: article.file, title: article.title });
          } else {
            console.log(`✗ ${article.file}: ${result.message || 'Unknown error'}`);
            resolve({ success: false, file: article.file, error: result.message });
          }
        } catch (e) {
          console.log(`✗ ${article.file}: Parse error`);
          resolve({ success: false, file: article.file, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      console.log(`✗ ${article.file}: ${e.message}`);
      resolve({ success: false, file: article.file, error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

// メイン実行
async function main() {
  console.log('=== WordPressに新規ドラフト記事を作成 ===\n');

  const results = [];
  for (const article of articlesToCreate) {
    const result = await createArticle(article);
    results.push(result);
    // 少し待機（API負荷軽減）
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n=== 結果サマリー ===');
  const success = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  console.log(`成功: ${success.length}件`);
  if (success.length > 0) {
    console.log('\n作成された記事:');
    success.forEach(r => {
      console.log(`  - ID ${r.id}: ${r.title}`);
    });
  }
  console.log(`失敗: ${failed.length}件`);
  if (failed.length > 0) {
    failed.forEach(r => {
      console.log(`  - ${r.file}: ${r.error}`);
    });
  }
}

main();
