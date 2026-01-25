const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Vietnam CTA (full version with 2 buttons)
const vietnamCTA = `<div class="cta-box cta-jobseeker-vietnam-full" style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
<h3 style="color: #fef08a; margin: 0 0 15px 0;">キャリアリンクベトナムでベトナム転職を実現</h3>
<p style="margin: 0 0 20px 0; line-height: 1.8;">当社はホーチミン・ハノイに拠点を持ち、ベトナムの日系企業求人を多数取り扱っています。現地在住の日本人コンサルタントが、求人紹介から入社後のフォローまでトータルでサポートいたします。</p>
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 20px;">
<a href="https://kyujin.careerlink.asia/vietnam/job/list" style="display: inline-block; background: #fef08a; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">ベトナムの求人一覧を見る</a>
<a href="https://kyujin.careerlink.asia/register" style="display: inline-block; background: white; color: #1e40af; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">無料会員登録はこちら</a>
</div>
</div>`;

async function main() {
    // Fetch the current content
    const getOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7726?context=edit',
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

    // Find H2 headings to understand structure
    const h2Matches = [...content.matchAll(/<h2[^>]*>([^<]*)<\/h2>/gi)];
    console.log('\nH2 headings found:');
    h2Matches.forEach((m, i) => {
        const pos = m.index;
        const percent = Math.round((pos / content.length) * 100);
        console.log(`  ${i+1}. [${percent}%] ${m[1].substring(0, 50)}`);
    });

    // 1. Add TOC shortcode at the very beginning
    if (!content.includes('[toc')) {
        content = '[toc heading_levels="2,3"]\n\n' + content;
        console.log('\nAdded TOC shortcode at beginning');
    }

    // 2. Find good positions for CTAs
    // For a ~43k char article, we need 3 CTAs
    // 1st: after introductory section (around 10-20%)
    // 2nd: at middle (around 50%)
    // 3rd: at end (before any closing content)

    // Find the end of the intro section (after "ベトナムへの転職をお考えの方へ" section)
    const introEndMarker = '日本人材が求められています。';
    const introEndPos = content.indexOf(introEndMarker);

    if (introEndPos > -1) {
        // Find the next </p> after this marker
        const nextPEnd = content.indexOf('</p>', introEndPos);
        if (nextPEnd > -1) {
            const insertPos1 = nextPEnd + 4;
            // Insert first CTA
            content = content.substring(0, insertPos1) + '\n\n' + vietnamCTA + '\n\n' + content.substring(insertPos1);
            console.log('Added CTA #1 after intro section');
        }
    }

    // Find a good middle position - look for a major section break around 50%
    const midPoint = Math.floor(content.length / 2);
    // Find nearest H2 before midpoint
    const h2Pattern = /<h2[^>]*>/gi;
    let lastH2BeforeMid = null;
    let match;
    while ((match = h2Pattern.exec(content)) !== null) {
        if (match.index < midPoint) {
            lastH2BeforeMid = match;
        } else {
            break;
        }
    }

    if (lastH2BeforeMid) {
        // Insert CTA before this H2
        const insertPos2 = lastH2BeforeMid.index;
        content = content.substring(0, insertPos2) + vietnamCTA + '\n\n' + content.substring(insertPos2);
        console.log('Added CTA #2 at middle section');
    }

    // Find end position - before "関連記事" or at the very end
    let endInsertPos = content.length;
    const relatedMarkers = ['関連記事', '出典', '参考', '<h2>まとめ', '## まとめ'];
    for (const marker of relatedMarkers) {
        const pos = content.lastIndexOf(marker);
        if (pos > content.length * 0.8) {  // Only if it's in the last 20%
            endInsertPos = Math.min(endInsertPos, pos);
        }
    }

    // Insert final CTA
    content = content.substring(0, endInsertPos) + '\n\n' + vietnamCTA + '\n\n' + content.substring(endInsertPos);
    console.log('Added CTA #3 at end');

    console.log('\nNew length:', content.length);

    // Save for review
    fs.writeFileSync('temp_vietnam_content.html', content);
    console.log('Content saved to temp_vietnam_content.html for review');

    // Update the post
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7726',
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
        console.log('\nPost 7726 updated successfully!');
        console.log('URL: https://kyujin.careerlink.asia/blog/vietnam-job-complete-guide/');
    } else {
        console.log('\nError updating post:', result.status);
        console.log(result.data.substring(0, 500));
    }
}

main().catch(console.error);
