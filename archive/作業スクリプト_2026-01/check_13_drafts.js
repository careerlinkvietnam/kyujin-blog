const fs = require('fs');
const path = require('path');

const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// 現在の未公開13記事
const unpublishedFiles = [
    'TH-12_タイ日系企業の福利厚生比較.html',
    'TH-13_タイでリモートワーク求人.html',
    'TH-19_タイで外国人が働く際の法的注意点.html',
    'TH-24_タイと日本の租税条約解説.html',
    'TH-28_タイ日本経済連携の最新状況.html',
    'TH-34_タイの治安と安全対策2026.html',
    'TH-35_チェンマイ生活費ガイド.html',
    'VN-12_ベトナム日系企業の福利厚生比較.html',
    'VN-13_ベトナムでリモートワーク求人.html',
    'VN-19_ベトナムで外国人が働く際の法的注意点.html',
    'VN-25_ベトナムと日本の租税条約解説.html',
    'VN-29_ベトナム日本経済連携の最新状況.html',
    'VN-36_ベトナムの治安と安全対策2026.html'
];

console.log('=== 未公開13記事 品質チェック ===\n');

let okCount = 0;
let issueCount = 0;

unpublishedFiles.forEach(filename => {
    const filePath = path.join(DRAFT_FOLDER, filename);
    if (!fs.existsSync(filePath)) {
        console.log('[MISSING] ' + filename);
        issueCount++;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    // 1. HTMLドキュメント構造チェック
    if (content.includes('<!DOCTYPE') || content.includes('<html')) {
        issues.push('HTMLドキュメント構造あり');
    }

    // 2. CDATAタグチェック
    if (content.includes('<![CDATA[') || content.includes(']]>')) {
        issues.push('CDATAタグあり');
    }

    // 3. h1タグチェック
    if (/<h1[^>]*>/i.test(content)) {
        issues.push('h1タグあり');
    }

    // 4. CTAリンクチェック
    if (!content.includes('/jobseeker/register')) {
        issues.push('CTAリンクなし');
    }

    // 5. 関連記事セクションチェック
    if (!content.includes('関連記事')) {
        issues.push('関連記事なし');
    }

    // 6. h2見出しチェック
    if (!/<h2[^>]*>/i.test(content)) {
        issues.push('h2見出しなし');
    }

    // 7. 禁止ワードチェック
    if (content.includes('法人設立')) {
        issues.push('禁止ワード「法人設立」');
    }

    // 文字数
    const textOnly = content.replace(/<[^>]+>/g, '').replace(/\s+/g, '');

    if (issues.length > 0) {
        console.log('[NG] ' + filename + ' (' + textOnly.length + '文字)');
        issues.forEach(issue => console.log('     - ' + issue));
        issueCount++;
    } else {
        console.log('[OK] ' + filename + ' (' + textOnly.length + '文字)');
        okCount++;
    }
});

console.log('\n=== 結果 ===');
console.log('問題なし: ' + okCount + '件');
console.log('問題あり: ' + issueCount + '件');
