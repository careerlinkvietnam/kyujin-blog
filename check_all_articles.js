const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// All 129 article IDs from January 2026
const articleIds = [
    // Initial 13
    7726, 7998, 8009, 8574, 8573, 8564, 8563, 8538, 8537, 8534, 8529, 8528, 8527,
    // Thailand
    8535, 8533, 8532, 8531, 8506, 8325, 8324, 8323, 8322, 8321, 8318,
    8245, 8244, 8243, 8241, 8239, 8238, 8237, 8236, 8234, 8232, 8231, 8230, 8229,
    8133, 8132, 8131, 8130, 8129, 8128, 8122, 8121, 8120, 8119, 8117, 8115, 8113,
    8034, 8033, 8008, 8005, 7997, 7734, 7721, 7710, 7676,
    // Vietnam
    8536, 8530, 8332, 8331, 8330, 8329, 8328, 8327,
    8272, 8271, 8270, 8269, 8268, 8267, 8266, 8265, 8264, 8263, 8262, 8261, 8260, 8259,
    8141, 8140, 8139, 8138, 8137, 8136, 8135, 8126, 8125, 8124, 8123, 8118, 8116, 8114,
    8036, 8035, 8024, 8003, 7995, 7737, 7735, 7715, 7702,
    // SEA/Other
    8526, 8525, 8512, 8510, 8505, 8504,
    7940, 7939, 7938, 7935, 7739, 7738, 7732, 7730,
    7720, 7718, 7712, 7711, 7705, 7698, 7691, 7689, 7686, 7675,
    8326
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
                try {
                    const post = JSON.parse(data);
                    const content = post.content?.raw || '';

                    const issues = [];

                    // Check for multiple 関連記事 sections
                    const h2Count = (content.match(/<h2[^>]*>関連記事<\/h2>/gi) || []).length;
                    const h3Count = (content.match(/<h3[^>]*>関連記事<\/h3>/gi) || []).length;
                    const encodedCount = (content.match(/&#x95A2;&#x9023;&#x8A18;&#x4E8B;/gi) || []).length;

                    if (h2Count > 1) issues.push(`H2関連記事x${h2Count}`);
                    if (h3Count > 0) issues.push(`H3関連記事x${h3Count}`);
                    if (encodedCount > 0) issues.push(`HTML-encoded関連記事x${encodedCount}`);
                    if (h2Count + h3Count + encodedCount > 1) issues.push('重複あり');

                    // Check for legacy CTAs - only count if in a styled CTA div
                    const legacyCtaPatterns = [
                        { text: 'ハノイで働くことに興味はありませんか', name: 'ハノイ' },
                        { text: 'ホーチミンで働くことに興味はありませんか', name: 'ホーチミン' },
                        { text: 'ベトナムで働くことに興味はありませんか', name: 'ベトナム' },
                        { text: 'タイで働くことに興味はありませんか', name: 'タイ' },
                        { text: 'バンコクで働くことに興味はありませんか', name: 'バンコク' },
                        { text: '東南アジア進出・人材採用のご相談', name: 'SEA進出' },
                        { text: 'ベトナムで採用をお考えの人事担当者様へ', name: '人事担当者' },
                    ];

                    for (const pattern of legacyCtaPatterns) {
                        const idx = content.indexOf(pattern.text);
                        if (idx > -1) {
                            // Check if it's in a styled div (actual CTA) not just plain text
                            const before = content.substring(Math.max(0, idx - 500), idx);
                            if (before.includes('background:') || before.includes('background-color:') ||
                                before.includes('style="background') || before.includes('cta-box')) {
                                issues.push(`レガシーCTA:${pattern.name}`);
                            }
                        }
                    }

                    // Check for old URL patterns
                    if (content.includes('/jobseeker/register')) issues.push('古いURL:/jobseeker/register');

                    resolve({
                        id: postId,
                        title: post.title?.rendered?.substring(0, 40) || 'Unknown',
                        issues: issues,
                        h2Count,
                        h3Count,
                        encodedCount
                    });
                } catch (e) {
                    resolve({ id: postId, title: 'Error', issues: ['Parse error'], h2Count: 0, h3Count: 0, encodedCount: 0 });
                }
            });
        });
        req.on('error', () => {
            resolve({ id: postId, title: 'Error', issues: ['Request error'], h2Count: 0, h3Count: 0, encodedCount: 0 });
        });
        req.end();
    });
}

async function main() {
    console.log('Checking', articleIds.length, 'articles for issues...\n');

    const problemArticles = [];

    // Process in batches of 10
    for (let i = 0; i < articleIds.length; i += 10) {
        const batch = articleIds.slice(i, i + 10);
        const results = await Promise.all(batch.map(id => checkArticle(id)));

        for (const result of results) {
            if (result.issues.length > 0) {
                problemArticles.push(result);
                console.log('ID', result.id, '-', result.title);
                console.log('  Issues:', result.issues.join(', '));
            }
        }

        console.log(`Progress: ${Math.min(i + 10, articleIds.length)}/${articleIds.length}`);
    }

    console.log('\n=== Summary ===');
    console.log('Total articles checked:', articleIds.length);
    console.log('Articles with issues:', problemArticles.length);

    if (problemArticles.length > 0) {
        console.log('\n=== Problem Articles ===');
        problemArticles.forEach(p => {
            console.log(p.id, ':', p.issues.join(', '));
        });
    } else {
        console.log('\nAll articles are OK!');
    }
}

main();
