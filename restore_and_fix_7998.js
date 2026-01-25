const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Vietnam B2B CTA (LP誘導用)
const vietnamB2BCTA = `<div class="cta-box cta-lp-vietnam" style="background: linear-gradient(135deg, #004d99 0%, #0066cc 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">ベトナムでの採用、判断材料が足りていますか？</h3>
<p style="margin: 16px 0;">採用難易度・給与相場・採用期間の目安を<strong>無料</strong>でお伝えします。</p>
<p><a href="https://kyujin.careerlink.asia/blog/vietnam-recruitment-consulting/" style="display: inline-block; background: #fff; color: #004d99; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">ベトナム採用の無料相談ページへ</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※相談無料・秘密厳守・1〜2営業日以内に返信</p>
</div>`;

// Vietnam HR CTA (案内用)
const vietnamHRCTA = `<div class="cta-box cta-hr-vietnam" style="background: #e8f4f8; border: 2px solid #0066cc; padding: 24px; margin: 30px 0; border-radius: 8px;">
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
</div>`;

async function main() {
    // Load from backup
    const posts = JSON.parse(fs.readFileSync('backup_2026-01-25/all_posts_backup.json'));
    const post = posts.find(p => p.id === 7998);

    if (!post) {
        console.log('Post not found in backup');
        return;
    }

    let content = post.content.raw;
    console.log('Original backup length:', content.length);

    // 1. Add TOC if not present
    if (!content.includes('[toc')) {
        content = '[toc heading_levels="2,3"]\n\n' + content;
        console.log('Added TOC shortcode');
    }

    // 2. Remove legacy CTA pattern 3: 東南アジア進出B2B
    const legacy3Start = content.indexOf('東南アジア進出・人材採用のご相談');
    if (legacy3Start > -1) {
        const divStart = content.lastIndexOf('<div', legacy3Start);
        const divEnd = content.indexOf('</div>', legacy3Start) + 6;
        if (divStart > -1 && divEnd > divStart) {
            content = content.substring(0, divStart) + content.substring(divEnd);
            console.log('Removed legacy CTA 3 (東南アジア進出B2B)');
        }
    }

    // 3. Remove legacy CTA pattern 4: ベトナム人事担当者向け
    const legacy4Start = content.indexOf('ベトナムで採用をお考えの人事担当者様へ');
    if (legacy4Start > -1) {
        const divStart = content.lastIndexOf('<div', legacy4Start);
        const divEnd = content.indexOf('</div>', legacy4Start) + 6;
        if (divStart > -1 && divEnd > divStart) {
            content = content.substring(0, divStart) + content.substring(divEnd);
            console.log('Removed legacy CTA 4 (ベトナム人事担当者向け)');
        }
    }

    // 4. Remove legacy CTA pattern 5: 専門家にご相談ください
    const legacy5Start = content.indexOf('専門家にご相談ください');
    if (legacy5Start > -1) {
        // This one is in a div with specific styling
        const divStart = content.lastIndexOf('<div style="background: #e3f2fd', legacy5Start);
        if (divStart === -1) {
            // Try alternative
            const divStartAlt = content.lastIndexOf('<div', legacy5Start);
        }
        const divEnd = content.indexOf('</div>', legacy5Start) + 6;
        if (divStart > -1 && divEnd > divStart) {
            content = content.substring(0, divStart) + content.substring(divEnd);
            console.log('Removed legacy CTA 5 (専門家にご相談ください)');
        }
    }

    // 5. Add new CTAs at appropriate positions
    const contentLength = content.length;

    // Find H2 positions
    const h2Pattern = /<h2[^>]*>/gi;
    let match;
    let h2Positions = [];
    while ((match = h2Pattern.exec(content)) !== null) {
        h2Positions.push(match.index);
    }

    // CTA 1: Around 12%
    const target1 = contentLength * 0.12;
    let insertPos1 = h2Positions.find(p => p > target1);
    if (insertPos1) {
        content = content.substring(0, insertPos1) + vietnamB2BCTA + '\n\n' + content.substring(insertPos1);
        console.log('Added CTA #1 (LP) at ~12%');
    }

    // Recalculate
    h2Positions = [];
    const h2Pattern2 = /<h2[^>]*>/gi;
    while ((match = h2Pattern2.exec(content)) !== null) {
        h2Positions.push(match.index);
    }

    // CTA 2: Around 50%
    const target2 = content.length * 0.50;
    let insertPos2 = h2Positions.find(p => p > target2);
    if (insertPos2) {
        content = content.substring(0, insertPos2) + vietnamHRCTA + '\n\n' + content.substring(insertPos2);
        console.log('Added CTA #2 (HR) at ~50%');
    }

    // Recalculate
    h2Positions = [];
    const h2Pattern3 = /<h2[^>]*>/gi;
    while ((match = h2Pattern3.exec(content)) !== null) {
        h2Positions.push(match.index);
    }

    // CTA 3: Before end (~90%)
    const target3 = content.length * 0.90;
    let insertPos3 = h2Positions.find(p => p > target3);
    if (insertPos3) {
        content = content.substring(0, insertPos3) + vietnamB2BCTA + '\n\n' + content.substring(insertPos3);
        console.log('Added CTA #3 (LP) at end');
    }

    console.log('Final length:', content.length);

    // Verify no legacy CTAs remain
    console.log('\nVerification:');
    console.log('- 東南アジア進出・人材採用のご相談:', content.includes('東南アジア進出・人材採用のご相談') ? 'FOUND' : 'not found');
    console.log('- ベトナムで採用をお考えの人事担当者様へ:', content.includes('ベトナムで採用をお考えの人事担当者様へ') ? 'FOUND' : 'not found');
    console.log('- 専門家にご相談ください:', content.includes('専門家にご相談ください') ? 'FOUND' : 'not found');
    console.log('- 外国人雇用の制限:', content.includes('外国人雇用の制限') ? 'preserved' : 'MISSING');

    // Update
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7998',
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
        console.log('\nPost 7998 restored and updated successfully!');
    } else {
        console.log('\nError:', result.status);
    }
}

main();
