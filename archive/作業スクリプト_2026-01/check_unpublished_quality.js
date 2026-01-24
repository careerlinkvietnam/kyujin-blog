const fs = require('fs');
const path = require('path');

const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// 未公開記事のみ
const unpublishedFiles = [
    'TH-01_タイ日系企業ランキング2026.html',
    'TH-02_タイ製造業求人完全ガイド.html',
    'TH-03_タイIT求人エンジニア転職ガイド.html',
    'TH-04_タイ営業職求人ガイド.html',
    'TH-05_タイ経理会計求人ガイド.html',
    'TH-06_タイ人事総務求人ガイド.html',
    'TH-12_タイ日系企業の福利厚生比較.html',
    'TH-13_タイでリモートワーク求人.html',
    'TH-14_タイBビザ申請方法2026.html',
    'TH-15_タイ解雇規定完全解説.html',
    'TH-16_タイ退職金制度完全解説.html',
    'TH-19_タイで外国人が働く際の法的注意点.html',
    'TH-20_タイ個人所得税完全ガイド2026.html',
    'TH-21_タイ社会保険制度解説.html',
    'TH-24_タイと日本の租税条約解説.html',
    'TH-25_タイ経済2026年見通し.html',
    'TH-28_タイ日本経済連携の最新状況.html',
    'TH-29_タイ日本人学校完全ガイド.html',
    'TH-30_タイインターナショナルスクールガイド.html',
    'TH-34_タイの治安と安全対策2026.html',
    'TH-35_チェンマイ生活費ガイド.html',
    'VN-01_ベトナム日系企業ランキング2026.html',
    'VN-02_ベトナム製造業求人完全ガイド.html',
    'VN-03_ベトナムIT求人エンジニア転職ガイド.html',
    'VN-04_ベトナム営業職求人ガイド.html',
    'VN-05_ベトナム経理会計求人ガイド.html',
    'VN-06_ベトナム人事総務求人ガイド.html',
    'VN-12_ベトナム日系企業の福利厚生比較.html',
    'VN-13_ベトナムでリモートワーク求人.html',
    'VN-14_ベトナム就労ビザ申請方法2026.html',
    'VN-15_ベトナム解雇規定完全解説.html',
    'VN-16_ベトナム退職金制度完全解説.html',
    'VN-19_ベトナムで外国人が働く際の法的注意点.html',
    'VN-20_ベトナム個人所得税完全ガイド2026.html',
    'VN-21_ベトナム社会保険制度解説.html',
    'VN-25_ベトナムと日本の租税条約解説.html',
    'VN-29_ベトナム日本経済連携の最新状況.html',
    'VN-36_ベトナムの治安と安全対策2026.html'
];

console.log(`=== 未公開記事品質チェック ===\n`);
console.log(`チェック対象: ${unpublishedFiles.length} ファイル\n`);

const issues = [];

unpublishedFiles.forEach(filename => {
    const filePath = path.join(DRAFT_FOLDER, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`[SKIP] ${filename} - ファイルなし`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const fileIssues = [];

    // 1. HTMLドキュメント構造チェック
    if (content.includes('<!DOCTYPE') || content.includes('<html')) {
        fileIssues.push('HTMLドキュメント構造あり');
    }
    if (content.includes('<head>') || content.includes('<body>')) {
        fileIssues.push('head/bodyタグあり');
    }

    // 2. CDATAタグチェック
    if (content.includes('<![CDATA[') || content.includes(']]>')) {
        fileIssues.push('CDATAタグあり');
    }

    // 3. h1タグチェック
    if (/<h1[^>]*>/i.test(content)) {
        fileIssues.push('h1タグあり');
    }

    // 4. CTAリンクチェック
    if (!content.includes('/jobseeker/register')) {
        fileIssues.push('CTAリンクなし');
    }

    // 5. 関連記事セクションチェック
    if (!content.includes('関連記事')) {
        fileIssues.push('関連記事なし');
    }

    // 6. h2見出しチェック
    if (!/<h2[^>]*>/i.test(content)) {
        fileIssues.push('h2見出しなし');
    }

    // 7. 禁止ワードチェック
    if (content.includes('法人設立')) {
        fileIssues.push('禁止ワード「法人設立」');
    }

    // 8. テーブル構造チェック
    const tableOpen = (content.match(/<table/gi) || []).length;
    const tableClose = (content.match(/<\/table>/gi) || []).length;
    if (tableOpen !== tableClose) {
        fileIssues.push(`テーブルタグ不整合`);
    }

    // 文字数
    const textOnly = content.replace(/<[^>]+>/g, '').replace(/\s+/g, '');

    if (fileIssues.length > 0) {
        issues.push({ filename, issues: fileIssues, chars: textOnly.length });
    }
});

// 結果出力
if (issues.length === 0) {
    console.log('✅ すべての未公開記事に問題はありません！');
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
console.log(`チェック済み: ${unpublishedFiles.length} ファイル`);
console.log(`問題あり: ${issues.length} ファイル`);
console.log(`問題なし: ${unpublishedFiles.length - issues.length} ファイル`);
