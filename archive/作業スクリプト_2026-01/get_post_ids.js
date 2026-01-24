const https = require('https');

const API_BASE = 'kyujin.careerlink.asia';
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

function fetchPosts(page) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: API_BASE,
            port: 443,
            path: `/blog/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,slug,title`,
            method: 'GET',
            headers: {
                'Authorization': `Basic ${AUTH}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    resolve([]);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    // 2026年1月に公開した記事のslug一覧（CDATAタグ問題があったもの）
    const targetSlugs = [
        'thailand-salary-guide-2026',           // TH-07
        'thailand-expat-vs-local-hire-salary-2026', // TH-08
        'thailand-call-center-jobs-guide-2026', // TH-09
        'chiangmai-jobs-career-guide-2026',     // TH-10
        'sriracha-jobs-career-guide-2026',      // TH-11
        'thailand-visa-extension-renewal-guide-2026', // TH-18
        'thailand-tax-return-guide-for-japanese-2026', // TH-22
        'thailand-corporate-tax-boi-incentives-guide-2026', // TH-23
        'thailand-ev-policy-automotive-transformation-2026', // TH-27
        'thailand-health-insurance-guide-2026', // TH-31
        'thailand-hospitals-medical-facilities-guide-2026', // TH-32
        'bangkok-residential-area-guide-2026',  // TH-33
        'vietnam-salary-guide-2026',            // VN-07
        'vietnam-expat-vs-local-hire-salary-2026', // VN-08
        'vietnam-labor-contract-guide-2026',    // VN-17
        'vietnam-health-insurance-guide-2026',  // VN-32
        'vietnam-hospitals-medical-facilities-guide-2026', // VN-33
        'hochiminh-residential-area-guide-2026', // VN-34
        'hanoi-residential-area-guide-2026'     // VN-35
    ];

    console.log('WordPressから投稿一覧を取得中...\n');

    let allPosts = [];
    for (let page = 1; page <= 3; page++) {
        const posts = await fetchPosts(page);
        if (posts.length === 0) break;
        allPosts = allPosts.concat(posts);
    }

    console.log(`取得した投稿数: ${allPosts.length}\n`);

    // slug -> ID のマッピングを作成
    const slugToId = {};
    allPosts.forEach(p => {
        slugToId[p.slug] = p.id;
    });

    // 対象記事のID一覧を表示
    console.log('=== 更新対象記事 ===\n');
    const results = [];
    targetSlugs.forEach(slug => {
        const id = slugToId[slug];
        if (id) {
            console.log(`${id}: ${slug}`);
            results.push({ id, slug });
        } else {
            console.log(`[未発見] ${slug}`);
        }
    });

    // JSON形式で出力（後で使う用）
    console.log('\n=== JSON出力 ===');
    console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
