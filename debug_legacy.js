const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

async function checkArticle(postId, searchText) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: `/blog/wp-json/wp/v2/posts/${postId}?context=edit`,
            method: 'GET',
            headers: { 'Authorization': `Basic ${auth}` }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                const post = JSON.parse(data);
                const content = post.content?.raw || '';

                const idx = content.indexOf(searchText);
                if (idx > -1) {
                    // Show context around the match
                    const start = Math.max(0, idx - 500);
                    const end = Math.min(content.length, idx + searchText.length + 500);
                    console.log('=== Found at position', idx, '===');
                    console.log(content.substring(start, end));
                    console.log('\n\n');
                }
                resolve();
            });
        });
        req.end();
    });
}

async function main() {
    // Check 7734 for バンコク legacy CTA
    console.log('=== 7734: バンコク ===');
    await checkArticle(7734, 'バンコクで働くことに興味はありませんか');

    // Check 8266 for 専門家 legacy CTA
    console.log('=== 8266: 専門家 ===');
    await checkArticle(8266, '専門家にご相談ください');

    // Check 7735 for ホーチミン legacy CTA
    console.log('=== 7735: ホーチミン ===');
    await checkArticle(7735, 'ホーチミンで働くことに興味はありませんか');

    // Check 7702 for ベトナム legacy CTA
    console.log('=== 7702: ベトナム ===');
    await checkArticle(7702, 'ベトナムで働くことに興味はありませんか');
}

main();
