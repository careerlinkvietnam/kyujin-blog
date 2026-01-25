const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Updated article IDs
const articleIds = [7726, 7998, 8009, 8574, 8573, 8564, 8563, 8538, 8537, 8534, 8529, 8528, 8527];

// Legacy patterns to check
const legacyPatterns = [
    '東南アジア進出・人材採用のご相談',
    '専門家にご相談ください',
    'ベトナムで採用をお考えの人事担当者様へ',
    'ベトナムで働くことに興味はありませんか',
    'タイで働くことに興味はありませんか',
    'cta-light',
    'cta-standard',
    'cta-strong'
];

async function checkArticle(postId) {
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
                const content = post.content.raw || '';

                const found = [];
                for (const pattern of legacyPatterns) {
                    if (content.includes(pattern)) {
                        found.push(pattern);
                    }
                }

                resolve({
                    id: postId,
                    title: post.title.rendered,
                    found: found
                });
            });
        });
        req.end();
    });
}

async function main() {
    console.log('Checking', articleIds.length, 'articles for legacy CTAs...\n');

    const results = [];
    for (const id of articleIds) {
        const result = await checkArticle(id);
        results.push(result);

        if (result.found.length > 0) {
            console.log('ID', result.id, '-', result.title.substring(0, 40));
            console.log('  LEGACY FOUND:', result.found.join(', '));
        } else {
            console.log('ID', result.id, '- OK');
        }
    }

    console.log('\n=== Summary ===');
    const withLegacy = results.filter(r => r.found.length > 0);
    console.log('Articles with legacy CTAs:', withLegacy.length);

    if (withLegacy.length > 0) {
        console.log('\nArticles needing cleanup:');
        withLegacy.forEach(r => {
            console.log('-', r.id, ':', r.found.join(', '));
        });
    }
}

main();
