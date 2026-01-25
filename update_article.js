const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const postId = process.argv[2];

if (!postId) {
    console.log('Usage: node update_article.js <postId> <country> <target>');
    console.log('  country: VN, TH, SEA');
    console.log('  target: B2B, JOBSEEKER');
    process.exit(1);
}

const country = process.argv[3] || 'VN';
const target = process.argv[4] || 'B2B';

// CTA Templates
const CTAs = {
    'VN-B2B-LP': `<div class="cta-box cta-lp-vietnam" style="background: linear-gradient(135deg, #004d99 0%, #0066cc 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">ベトナムでの採用、判断材料が足りていますか？</h3>
<p style="margin: 16px 0;">採用難易度・給与相場・採用期間の目安を<strong>無料</strong>でお伝えします。</p>
<p><a href="https://kyujin.careerlink.asia/blog/vietnam-recruitment-consulting/" style="display: inline-block; background: #fff; color: #004d99; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">ベトナム採用の無料相談ページへ</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※相談無料・秘密厳守・1〜2営業日以内に返信</p>
</div>`,

    'VN-B2B-HR': `<div class="cta-box cta-hr-vietnam" style="background: #e8f4f8; border: 2px solid #0066cc; padding: 24px; margin: 30px 0; border-radius: 8px;">
<h3 style="margin-top: 0; margin-bottom: 12px; color: #004d99;">【企業の人事・採用担当者様へ】ベトナムでの人材採用をサポートします</h3>
<p style="margin: 0 0 12px 0;">キャリアリンクベトナムは、ベトナムの日系企業向け人材紹介サービスを提供しています。</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.6;">
<li style="margin-bottom: 2px;">ベトナム人スタッフ・日本語人材の紹介</li>
<li style="margin-bottom: 2px;">ベトナムで働きたい日本人の紹介</li>
<li style="margin-bottom: 2px;">現地の給与相場・採用市場のご案内</li>
</ul>
<p style="margin: 0 0 12px 0;"><strong>まずはお気軽にご相談ください。</strong></p>
<p style="margin: 0 0 8px 0;"><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #004d99; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: bold;">採用のご相談・お問い合わせ</a></p>
<p style="font-size: 0.9em; color: #666; margin: 0;">※初回相談無料・1〜2営業日以内に返信</p>
</div>`,

    'TH-B2B-LP': `<div class="cta-box cta-lp-thailand" style="background: linear-gradient(135deg, #004d99 0%, #0066cc 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">タイでの採用、判断材料が足りていますか？</h3>
<p style="margin: 16px 0;">採用難易度・給与相場・採用期間の目安を<strong>無料</strong>でお伝えします。</p>
<p><a href="https://kyujin.careerlink.asia/blog/thailand-recruitment-consulting/" style="display: inline-block; background: #fff; color: #004d99; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">タイ採用の無料相談ページへ</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※相談無料・秘密厳守・1〜2営業日以内に返信</p>
</div>`,

    'TH-B2B-HR': `<div class="cta-box cta-hr-thailand" style="background: #e8f4f8; border: 2px solid #0066cc; padding: 24px; margin: 30px 0; border-radius: 8px;">
<h3 style="margin-top: 0; margin-bottom: 12px; color: #004d99;">【企業の人事・採用担当者様へ】タイでの人材採用をサポートします</h3>
<p style="margin: 0 0 12px 0;">キャリアリンクリクルートメントタイランドは、タイの日系企業向け人材紹介サービスを提供しています。</p>
<ul style="margin: 0 0 12px 0; padding-left: 20px; line-height: 1.6;">
<li style="margin-bottom: 2px;">タイ人スタッフ・日本語人材の紹介</li>
<li style="margin-bottom: 2px;">タイで働きたい日本人の紹介</li>
<li style="margin-bottom: 2px;">現地の給与相場・採用市場のご案内</li>
</ul>
<p style="margin: 0 0 12px 0;"><strong>まずはお気軽にご相談ください。</strong></p>
<p style="margin: 0 0 8px 0;"><a href="https://kyujin.careerlink.asia/お問い合わせ" style="display: inline-block; background: #004d99; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: bold;">採用のご相談・お問い合わせ</a></p>
<p style="font-size: 0.9em; color: #666; margin: 0;">※初回相談無料・1〜2営業日以内に返信</p>
</div>`,

    'VN-JOBSEEKER': `<div class="cta-box cta-jobseeker-vietnam-full" style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
<h3 style="color: #fef08a; margin: 0 0 15px 0;">キャリアリンクベトナムでベトナム転職を実現</h3>
<p style="margin: 0 0 20px 0; line-height: 1.8;">当社はホーチミン・ハノイに拠点を持ち、ベトナムの日系企業求人を多数取り扱っています。現地在住の日本人コンサルタントが、求人紹介から入社後のフォローまでトータルでサポートいたします。</p>
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 20px;">
<a href="https://kyujin.careerlink.asia/vietnam/job/list" style="display: inline-block; background: #fef08a; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">ベトナムの求人一覧を見る</a>
<a href="https://kyujin.careerlink.asia/register" style="display: inline-block; background: white; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">無料会員登録はこちら</a>
</div>
</div>`,

    'TH-JOBSEEKER': `<div class="cta-box cta-jobseeker-thailand-full" style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
<h3 style="color: #fef08a; margin: 0 0 15px 0;">キャリアリンクリクルートメントタイランドでタイ転職を実現</h3>
<p style="margin: 0 0 20px 0; line-height: 1.8;">当社はバンコクに拠点を持ち、タイの日系企業求人を多数取り扱っています。現地在住の日本人コンサルタントが、求人紹介から入社後のフォローまでトータルでサポートいたします。</p>
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 20px;">
<a href="https://kyujin.careerlink.asia/thailand/job/list" style="display: inline-block; background: #fef08a; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">タイの求人一覧を見る</a>
<a href="https://kyujin.careerlink.asia/register" style="display: inline-block; background: white; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">無料会員登録はこちら</a>
</div>
</div>`
};

async function main() {
    // Fetch
    const getOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: `/blog/wp-json/wp/v2/posts/${postId}?context=edit`,
        method: 'GET',
        headers: { 'Authorization': `Basic ${auth}` }
    };

    const post = await new Promise((resolve) => {
        const req = https.request(getOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });

    let content = post.content.raw;
    console.log('Post:', postId, '-', post.title.rendered);
    console.log('Original length:', content.length);
    console.log('Country:', country, '| Target:', target);

    // 1. Add TOC if not present
    if (!content.includes('[toc')) {
        content = '[toc heading_levels="2,3"]\n\n' + content;
        console.log('Added TOC');
    }

    // 2. Remove existing cta-box CTAs to avoid duplicates
    const ctaPattern = /<div[^>]*class="[^"]*cta-box[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
    let existingCTAs = (content.match(ctaPattern) || []).length;
    if (existingCTAs > 0) {
        content = content.replace(ctaPattern, '');
        console.log('Removed', existingCTAs, 'existing CTAs');
    }

    // 3. Find H2 positions for CTA insertion
    const h2Pattern = /<h2[^>]*>/gi;
    let match;
    let h2Positions = [];
    while ((match = h2Pattern.exec(content)) !== null) {
        h2Positions.push(match.index);
    }

    // Determine CTA count based on content length
    const len = content.length;
    let ctaCount = len > 30000 ? 3 : len > 10000 ? 2 : 1;
    console.log('Content length:', len, '-> CTA count:', ctaCount);

    // Select CTAs based on country and target
    let cta1, cta2;
    if (target === 'B2B') {
        cta1 = CTAs[`${country}-B2B-LP`];
        cta2 = CTAs[`${country}-B2B-HR`];
    } else {
        cta1 = CTAs[`${country}-JOBSEEKER`];
        cta2 = CTAs[`${country}-JOBSEEKER`];
    }

    // Insert CTAs
    if (ctaCount >= 1 && h2Positions.length > 2) {
        // First CTA at around 30-40%
        const target1 = content.length * 0.35;
        let insertPos1 = h2Positions.find(p => p > target1);
        if (insertPos1) {
            content = content.substring(0, insertPos1) + cta1 + '\n\n' + content.substring(insertPos1);
            console.log('Added CTA #1 at ~35%');
        }
    }

    // Recalculate H2 positions
    h2Positions = [];
    const h2Pattern2 = /<h2[^>]*>/gi;
    while ((match = h2Pattern2.exec(content)) !== null) {
        h2Positions.push(match.index);
    }

    if (ctaCount >= 2) {
        // Find position before 関連記事 or at ~90%
        const relatedIdx = content.indexOf('<h2>関連記事</h2>');
        let insertPos2;
        if (relatedIdx > content.length * 0.7) {
            insertPos2 = relatedIdx;
        } else {
            const target2 = content.length * 0.90;
            insertPos2 = h2Positions.find(p => p > target2) || h2Positions[h2Positions.length - 1];
        }
        if (insertPos2) {
            content = content.substring(0, insertPos2) + cta2 + '\n\n' + content.substring(insertPos2);
            console.log('Added CTA #2 before 関連記事');
        }
    }

    // For long articles, add a third CTA
    if (ctaCount >= 3) {
        h2Positions = [];
        const h2Pattern3 = /<h2[^>]*>/gi;
        while ((match = h2Pattern3.exec(content)) !== null) {
            h2Positions.push(match.index);
        }
        const target3 = content.length * 0.65;
        let insertPos3 = h2Positions.find(p => p > target3);
        if (insertPos3) {
            content = content.substring(0, insertPos3) + cta1 + '\n\n' + content.substring(insertPos3);
            console.log('Added CTA #3 at ~65%');
        }
    }

    console.log('Final length:', content.length);

    // Update
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: `/blog/wp-json/wp/v2/posts/${postId}`,
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const result = await new Promise((resolve) => {
        const req = https.request(postOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve({ status: res.statusCode }));
        });
        req.write(postData);
        req.end();
    });

    if (result.status === 200) {
        console.log('\nUpdated successfully!');
        console.log('URL:', post.link);
    } else {
        console.log('\nError:', result.status);
    }
}

main();
