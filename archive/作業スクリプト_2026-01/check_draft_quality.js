const fs = require('fs');
const path = require('path');

const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// チェック対象：TH-*, VN-*で始まるファイル
const files = fs.readdirSync(DRAFT_FOLDER)
    .filter(f => (f.startsWith('TH-') || f.startsWith('VN-')) && f.endsWith('.html'))
    .sort();

console.log(`=== ドラフト記事品質チェック ===\n`);
console.log(`チェック対象: ${files.length} ファイル\n`);

const issues = [];

files.forEach(filename => {
    const filePath = path.join(DRAFT_FOLDER, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const fileIssues = [];

    // 1. HTMLドキュメント構造チェック
    if (content.includes('<!DOCTYPE') || content.includes('<html')) {
        fileIssues.push('HTMLドキュメント構造あり（DOCTYPE/html）');
    }
    if (content.includes('<head>') || content.includes('<body>')) {
        fileIssues.push('head/bodyタグあり');
    }

    // 2. CDATAタグチェック
    if (content.includes('<![CDATA[') || content.includes(']]>')) {
        fileIssues.push('CDATAタグあり');
    }

    // 3. h1タグチェック（WordPressは別途タイトルを追加）
    if (/<h1[^>]*>/i.test(content)) {
        fileIssues.push('h1タグあり（削除推奨）');
    }

    // 4. CTAリンクチェック
    if (!content.includes('/jobseeker/register')) {
        fileIssues.push('CTAリンクなし');
    }

    // 5. 関連記事セクションチェック
    if (!content.includes('関連記事')) {
        fileIssues.push('関連記事セクションなし');
    }

    // 6. 空のコンテンツチェック
    if (content.trim().length < 1000) {
        fileIssues.push(`コンテンツが短い（${content.length}文字）`);
    }

    // 7. テーブル構造チェック（閉じタグ）
    const tableOpen = (content.match(/<table/gi) || []).length;
    const tableClose = (content.match(/<\/table>/gi) || []).length;
    if (tableOpen !== tableClose) {
        fileIssues.push(`テーブルタグ不整合（開:${tableOpen}, 閉:${tableClose}）`);
    }

    // 8. リスト構造チェック
    const ulOpen = (content.match(/<ul>/gi) || []).length;
    const ulClose = (content.match(/<\/ul>/gi) || []).length;
    if (ulOpen !== ulClose) {
        fileIssues.push(`ulタグ不整合（開:${ulOpen}, 閉:${ulClose}）`);
    }

    const olOpen = (content.match(/<ol>/gi) || []).length;
    const olClose = (content.match(/<\/ol>/gi) || []).length;
    if (olOpen !== olClose) {
        fileIssues.push(`olタグ不整合（開:${olOpen}, 閉:${olClose}）`);
    }

    // 9. 見出し構造チェック（h2が存在するか）
    if (!/<h2[^>]*>/i.test(content)) {
        fileIssues.push('h2見出しなし');
    }

    // 10. 禁止ワードチェック
    if (content.includes('法人設立')) {
        fileIssues.push('禁止ワード「法人設立」あり');
    }

    // 11. 文字数カウント
    const textOnly = content.replace(/<[^>]+>/g, '').replace(/\s+/g, '');

    if (fileIssues.length > 0) {
        issues.push({ filename, issues: fileIssues, chars: textOnly.length });
    }
});

// 結果出力
if (issues.length === 0) {
    console.log('✅ すべてのファイルに問題はありません！');
} else {
    console.log(`⚠️ ${issues.length} ファイルに問題があります:\n`);
    issues.forEach(item => {
        console.log(`【${item.filename}】(${item.chars}文字)`);
        item.issues.forEach(issue => {
            console.log(`  - ${issue}`);
        });
        console.log('');
    });
}

// サマリー
console.log('\n=== サマリー ===');
console.log(`チェック済み: ${files.length} ファイル`);
console.log(`問題あり: ${issues.length} ファイル`);
console.log(`問題なし: ${files.length - issues.length} ファイル`);
