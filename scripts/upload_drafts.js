const https = require('https');
const fs = require('fs');
const path = require('path');

// WordPress API設定
const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const API_HOST = 'kyujin.careerlink.asia';
const API_PATH = '/blog/wp-json/wp/v2/posts';

// 記事設定
const articles = [
  {
    file: '01_特定技能制度とは_2026年最新版.md',
    title: '特定技能制度とは？2026年最新版｜対象16分野・法改正を徹底解説',
    categories: [148, 273, 158], // ビジネス, 採用・雇用, 法律
    slug: 'specified-skilled-worker-visa-guide-2026'
  },
  {
    file: '02_技能実習制度と育成就労制度_2026年最新版.md',
    title: '技能実習制度とは？2027年「育成就労制度」への移行を徹底解説【2026年最新版】',
    categories: [148, 273, 158],
    slug: 'technical-intern-training-program-guide-2026'
  },
  {
    file: '03_ベトナムの大学ランキング_2026年版.md',
    title: 'ベトナムの大学ランキング（2026年版）｜採用担当者必見の最新情報',
    categories: [25, 148], // ベトナム, ビジネス
    slug: 'vietnam-university-ranking-2026'
  },
  {
    file: '04_育成就労制度とは_2027年施行.md',
    title: '育成就労制度とは？2027年4月施行の新制度を徹底解説',
    categories: [148, 273, 158],
    slug: 'ikusei-shuro-system-2027'
  },
  {
    file: '05_日越大学_2026年最新版.md',
    title: '日越大学（Vietnam Japan University）完全ガイド【2026年最新版】',
    categories: [25], // ベトナム
    slug: 'vietnam-japan-university-guide-2026'
  },
  {
    file: '06_ブンタウ観光ガイド_2026年最新版.md',
    title: 'ホーチミンから日帰りで行けるリゾート地「ブンタウ」完全ガイド【2026年最新版】',
    categories: [25, 140], // ベトナム, 旅行
    slug: 'vung-tau-travel-guide-2026'
  },
  {
    file: '07_ベトナムの工業団地_2026年最新版.md',
    title: 'ベトナムの工業団地ガイド【2026年最新版】｜日系企業の進出動向と主要エリア解説',
    categories: [25, 148], // ベトナム, ビジネス
    slug: 'vietnam-industrial-parks-guide-2026'
  },
  {
    file: '08_ベトナムでのアルバイト募集方法_2026年最新版.md',
    title: 'ベトナムでのアルバイト・人材募集方法【2026年最新版】',
    categories: [25, 148, 273], // ベトナム, ビジネス, 採用・雇用
    slug: 'vietnam-recruitment-methods-2026'
  },
  {
    file: '09_ホーチミンのラーメンマップ_2026年版.md',
    title: 'ベトナム ホーチミンのラーメンマップ【2026年版】',
    categories: [25, 4, 27], // ベトナム, ホーチミン, グルメ
    slug: 'ho-chi-minh-ramen-map-2026'
  },
  {
    file: '10_ハノイのラーメンマップ_2026年版.md',
    title: 'ベトナム ハノイのラーメンマップ【2026年版】',
    categories: [25, 14, 27], // ベトナム, ハノイ, グルメ
    slug: 'hanoi-ramen-map-2026'
  },
  {
    file: '11_ホーチミン金融街カフェ・バー_2026年版.md',
    title: 'ホーチミン金融街にある隠れ家カフェ・バーの紹介【2026年版】',
    categories: [25, 4, 27], // ベトナム, ホーチミン, グルメ
    slug: 'ho-chi-minh-finance-district-cafe-bar-2026'
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

  // 引用
  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

  // 水平線
  html = html.replace(/^---$/gm, '<hr>');

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

  return html;
}

// 記事をアップロード
function uploadArticle(article) {
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
      status: 'draft',
      categories: article.categories,
      slug: article.slug
    });

    const options = {
      hostname: API_HOST,
      path: API_PATH,
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
            console.log(`✓ ${article.title} (ID: ${result.id})`);
            resolve({ success: true, id: result.id, title: article.title });
          } else {
            console.log(`✗ ${article.title}: ${result.message || 'Unknown error'}`);
            resolve({ success: false, title: article.title, error: result.message });
          }
        } catch (e) {
          console.log(`✗ ${article.title}: Parse error`);
          resolve({ success: false, title: article.title, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      console.log(`✗ ${article.title}: ${e.message}`);
      resolve({ success: false, title: article.title, error: e.message });
    });

    req.write(postData);
    req.end();
  });
}

// メイン実行
async function main() {
  console.log('=== WordPressへドラフト記事をアップロード ===\n');

  const results = [];
  for (const article of articles) {
    const result = await uploadArticle(article);
    results.push(result);
    // 少し待機（API負荷軽減）
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n=== 結果サマリー ===');
  const success = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  console.log(`成功: ${success.length}件`);
  console.log(`失敗: ${failed.length}件`);

  if (success.length > 0) {
    console.log('\n作成された記事ID:');
    success.forEach(r => console.log(`  - ${r.id}: ${r.title}`));
  }
}

main();
