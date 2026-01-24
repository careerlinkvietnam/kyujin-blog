const fs = require('fs');
const path = require('path');

const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// 問題のあるファイルリスト
const problemFiles = [
    'TH-03_タイIT求人エンジニア転職ガイド.html',
    'TH-04_タイ営業職求人ガイド.html',
    'TH-05_タイ経理会計求人ガイド.html',
    'TH-06_タイ人事総務求人ガイド.html',
    'TH-12_タイ日系企業の福利厚生比較.html',
    'TH-13_タイでリモートワーク求人.html',
    'TH-14_タイBビザ申請方法2026.html',
    'TH-15_タイ解雇規定完全解説.html',
    'TH-16_タイ退職金制度完全解説.html',
    'TH-21_タイ社会保険制度解説.html',
    'TH-25_タイ経済2026年見通し.html',
    'TH-29_タイ日本人学校完全ガイド.html',
    'TH-30_タイインターナショナルスクールガイド.html',
    'TH-35_チェンマイ生活費ガイド.html',
    'VN-12_ベトナム日系企業の福利厚生比較.html',
    'VN-13_ベトナムでリモートワーク求人.html',
    'VN-14_ベトナム就労ビザ申請方法2026.html',
    'VN-15_ベトナム解雇規定完全解説.html',
    'VN-16_ベトナム退職金制度完全解説.html',
    'VN-19_ベトナムで外国人が働く際の法的注意点.html',
    'VN-21_ベトナム社会保険制度解説.html',
    'VN-25_ベトナムと日本の租税条約解説.html',
    'VN-29_ベトナム日本経済連携の最新状況.html',
    'VN-36_ベトナムの治安と安全対策2026.html'
];

// 関連記事リンク（タイ/ベトナム別）
const relatedArticlesTH = `
<h2>関連記事</h2>

<ul>
<li><a href="https://kyujin.careerlink.asia/blog/thailand-job-complete-guide/">タイ転職完全ガイド</a></li>
<li><a href="https://kyujin.careerlink.asia/blog/thailand-working-japanese-guide/">タイで働く日本人完全ガイド</a></li>
<li><a href="https://kyujin.careerlink.asia/blog/bangkok-job-guide/">バンコクの求人・就職事情</a></li>
</ul>`;

const relatedArticlesVN = `
<h2>関連記事</h2>

<ul>
<li><a href="https://kyujin.careerlink.asia/blog/vietnam-job-complete-guide/">ベトナム転職完全ガイド</a></li>
<li><a href="https://kyujin.careerlink.asia/blog/vietnam-japanese-company-guide/">ベトナムの日系企業で働く</a></li>
<li><a href="https://kyujin.careerlink.asia/blog/vietnam-living-cost-guide/">ベトナム生活費完全ガイド</a></li>
</ul>`;

// CTAセクション
const ctaSectionTH = `
<hr>

<p><strong>タイでのキャリアをお考えですか？</strong></p>

<p>CareerLink Asiaでは、タイでの就職・転職をサポートしています。まずはお気軽にご登録ください。</p>

<p style="text-align: center; margin: 30px 0;">
<a href="https://kyujin.careerlink.asia/jobseeker/register" style="display: inline-block; background: #007bff; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">無料会員登録はこちら</a>
</p>`;

const ctaSectionVN = `
<hr>

<p><strong>ベトナムでのキャリアをお考えですか？</strong></p>

<p>CareerLink Asiaでは、ベトナムでの就職・転職をサポートしています。まずはお気軽にご登録ください。</p>

<p style="text-align: center; margin: 30px 0;">
<a href="https://kyujin.careerlink.asia/jobseeker/register" style="display: inline-block; background: #007bff; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold;">無料会員登録はこちら</a>
</p>`;

console.log('=== ドラフト記事の問題修正 ===\n');

problemFiles.forEach(filename => {
    const filePath = path.join(DRAFT_FOLDER, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`[SKIP] ${filename} - ファイルなし`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let fixed = [];

    // 1. HTMLドキュメント構造を削除
    if (content.includes('<!DOCTYPE') || content.includes('<html')) {
        // articleタグ内のコンテンツを抽出
        const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
        if (articleMatch) {
            content = articleMatch[1].trim();
            fixed.push('HTMLドキュメント構造削除');
        } else {
            // bodyタグ内のコンテンツを抽出
            const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
                content = bodyMatch[1].trim();
                fixed.push('HTMLドキュメント構造削除（body抽出）');
            }
        }
    }

    // 2. h1タグを削除
    if (/<h1[^>]*>/i.test(content)) {
        content = content.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, '').trim();
        fixed.push('h1タグ削除');
    }

    // 3. インデント削除
    content = content.split('\n').map(line => line.trimStart()).join('\n');
    content = content.replace(/\n{3,}/g, '\n\n');

    // 4. 関連記事セクションがない場合は追加
    if (!content.includes('関連記事')) {
        const relatedArticles = filename.startsWith('TH-') ? relatedArticlesTH : relatedArticlesVN;
        content = content.trim() + '\n' + relatedArticles;
        fixed.push('関連記事セクション追加');
    }

    // 5. CTAリンクがない場合は追加
    if (!content.includes('/jobseeker/register')) {
        const ctaSection = filename.startsWith('TH-') ? ctaSectionTH : ctaSectionVN;
        content = content.trim() + '\n' + ctaSection;
        fixed.push('CTAセクション追加');
    }

    // 保存
    fs.writeFileSync(filePath, content.trim(), 'utf8');

    if (fixed.length > 0) {
        console.log(`[修正] ${filename}`);
        fixed.forEach(f => console.log(`  - ${f}`));
    }
});

console.log('\n=== 修正完了 ===');
