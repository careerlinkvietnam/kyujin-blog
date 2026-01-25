const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Thailand B2B CTA (LP誘導用)
const thailandB2BCTA = `<div class="cta-box cta-lp-thailand" style="background: linear-gradient(135deg, #004d99 0%, #0066cc 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">タイでの採用、判断材料が足りていますか？</h3>
<p style="margin: 16px 0;">採用難易度・給与相場・採用期間の目安を<strong>無料</strong>でお伝えします。</p>
<p><a href="https://kyujin.careerlink.asia/blog/thailand-recruitment-consulting/" style="display: inline-block; background: #fff; color: #004d99; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">タイ採用の無料相談ページへ</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※相談無料・秘密厳守・1〜2営業日以内に返信</p>
</div>`;

// Thailand HR CTA (案内用)
const thailandHRCTA = `<div class="cta-box cta-hr-thailand" style="background: #e8f4f8; border: 2px solid #0066cc; padding: 24px; margin: 30px 0; border-radius: 8px;">
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
</div>`;

async function main() {
    // Fetch
    const getOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/8009?context=edit',
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
    console.log('Original length:', content.length);

    // 1. Add TOC if not present
    if (!content.includes('[toc')) {
        content = '[toc heading_levels="2,3"]\n\n' + content;
        console.log('Added TOC shortcode');
    }

    // 2. Remove legacy SEA CTA
    const legacyStart = content.indexOf('東南アジア進出・人材採用のご相談');
    if (legacyStart > -1) {
        const divStart = content.lastIndexOf('<div', legacyStart);
        const divEnd = content.indexOf('</div>', legacyStart) + 6;
        if (divStart > -1 && divEnd > divStart) {
            content = content.substring(0, divStart) + content.substring(divEnd);
            console.log('Removed legacy SEA CTA');
        }
    }

    // 3. Remove any existing cta-box CTAs
    const ctaPattern = /<div[^>]*class="[^"]*cta-box[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
    let match;
    let matches = [];
    while ((match = ctaPattern.exec(content)) !== null) {
        matches.push({ index: match.index, length: match[0].length });
    }
    for (let i = matches.length - 1; i >= 0; i--) {
        content = content.substring(0, matches[i].index) + content.substring(matches[i].index + matches[i].length);
    }
    if (matches.length > 0) console.log('Removed', matches.length, 'existing cta-box CTAs');

    // 4. Add new CTAs at appropriate positions
    // For 84k article: ~10%, ~50%, end
    const h2Pattern = /<h2[^>]*>/gi;
    const h2Positions = [];
    while ((match = h2Pattern.exec(content)) !== null) {
        h2Positions.push(match.index);
    }

    // CTA 1: Around 10%
    const target1 = content.length * 0.10;
    let insertPos1 = h2Positions.find(p => p > target1);
    if (insertPos1) {
        content = content.substring(0, insertPos1) + thailandB2BCTA + '\n\n' + content.substring(insertPos1);
        console.log('Added CTA #1 (LP) at ~10%');
    }

    // Recalculate
    const h2Pattern2 = /<h2[^>]*>/gi;
    const h2Positions2 = [];
    while ((match = h2Pattern2.exec(content)) !== null) {
        h2Positions2.push(match.index);
    }

    // CTA 2: Around 50%
    const target2 = content.length * 0.50;
    let insertPos2 = h2Positions2.find(p => p > target2);
    if (insertPos2) {
        content = content.substring(0, insertPos2) + thailandHRCTA + '\n\n' + content.substring(insertPos2);
        console.log('Added CTA #2 (HR) at ~50%');
    }

    // CTA 3: Before end (find last h2 before 95%)
    const h2Pattern3 = /<h2[^>]*>/gi;
    const h2Positions3 = [];
    while ((match = h2Pattern3.exec(content)) !== null) {
        h2Positions3.push(match.index);
    }
    const endTarget = content.length * 0.92;
    let insertPos3 = h2Positions3.filter(p => p > endTarget)[0];
    if (insertPos3) {
        content = content.substring(0, insertPos3) + thailandB2BCTA + '\n\n' + content.substring(insertPos3);
        console.log('Added CTA #3 (LP) at end');
    }

    console.log('New length:', content.length);

    // Update
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/8009',
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
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.write(postData);
        req.end();
    });

    if (result.status === 200) {
        console.log('\nPost 8009 updated successfully!');
        console.log('URL: https://kyujin.careerlink.asia/blog/thailand-eec-investment-guide-2025-2026/');
    } else {
        console.log('Error:', result.status);
    }
}

main();
