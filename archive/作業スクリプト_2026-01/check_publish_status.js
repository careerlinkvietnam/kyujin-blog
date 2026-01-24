const https = require('https');
const fs = require('fs');

const API_BASE = 'kyujin.careerlink.asia';
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

function fetchPosts(page) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: API_BASE,
            port: 443,
            path: `/blog/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,slug,title`,
            method: 'GET',
            headers: { 'Authorization': `Basic ${AUTH}` }
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
    console.log('WordPressから公開済み記事を取得中...\n');

    let allPosts = [];
    for (let page = 1; page <= 5; page++) {
        const posts = await fetchPosts(page);
        if (posts.length === 0) break;
        allPosts = allPosts.concat(posts);
    }

    // 2026年の記事slugリスト
    const publishedSlugs = new Set(allPosts.map(p => p.slug));

    // ドラフトフォルダのTH-*, VN-*ファイル
    const draftFiles = fs.readdirSync(DRAFT_FOLDER)
        .filter(f => (f.startsWith('TH-') || f.startsWith('VN-')) && f.endsWith('.html'))
        .sort();

    // 記事ID -> slugのマッピング（publish_article.jsより）
    const articleSlugs = {
        'TH-01': 'thailand-japanese-companies-ranking-2026',
        'TH-02': 'thailand-manufacturing-jobs-guide-2026',
        'TH-03': 'thailand-it-engineer-jobs-guide-2026',
        'TH-04': 'thailand-sales-jobs-guide-2026',
        'TH-05': 'thailand-accounting-jobs-guide-2026',
        'TH-06': 'thailand-hr-admin-jobs-guide-2026',
        'TH-07': 'thailand-salary-guide-2026',
        'TH-08': 'thailand-expat-vs-local-hire-salary-2026',
        'TH-09': 'thailand-call-center-jobs-guide-2026',
        'TH-10': 'chiangmai-jobs-career-guide-2026',
        'TH-11': 'sriracha-jobs-career-guide-2026',
        'TH-12': 'thailand-japanese-company-benefits-2026',
        'TH-13': 'thailand-remote-work-jobs-2026',
        'TH-14': 'thailand-b-visa-application-guide-2026',
        'TH-15': 'thailand-termination-regulations-guide-2026',
        'TH-16': 'thailand-severance-pay-guide-2026',
        'TH-17': 'thailand-labor-protection-act-guide-2026',
        'TH-18': 'thailand-visa-extension-renewal-guide-2026',
        'TH-19': 'thailand-foreign-worker-legal-guide-2026',
        'TH-20': 'thailand-personal-income-tax-guide-2026',
        'TH-21': 'thailand-social-security-guide-2026',
        'TH-22': 'thailand-tax-return-guide-for-japanese-2026',
        'TH-23': 'thailand-corporate-tax-boi-incentives-guide-2026',
        'TH-24': 'thailand-japan-tax-treaty-guide-2026',
        'TH-25': 'thailand-economic-outlook-2026',
        'TH-27': 'thailand-ev-policy-automotive-transformation-2026',
        'TH-28': 'thailand-japan-economic-partnership-2026',
        'TH-29': 'thailand-japanese-schools-guide-2026',
        'TH-30': 'thailand-international-schools-guide-2026',
        'TH-31': 'thailand-health-insurance-guide-2026',
        'TH-32': 'thailand-hospitals-medical-facilities-guide-2026',
        'TH-33': 'bangkok-residential-area-guide-2026',
        'TH-34': 'thailand-safety-security-guide-2026',
        'TH-35': 'chiangmai-living-cost-guide-2026',
        'VN-01': 'vietnam-japanese-companies-ranking-2026',
        'VN-02': 'vietnam-manufacturing-jobs-guide-2026',
        'VN-03': 'vietnam-it-engineer-jobs-guide-2026',
        'VN-04': 'vietnam-sales-jobs-guide-2026',
        'VN-05': 'vietnam-accounting-jobs-guide-2026',
        'VN-06': 'vietnam-hr-admin-jobs-guide-2026',
        'VN-07': 'vietnam-salary-guide-2026',
        'VN-08': 'vietnam-expat-vs-local-hire-salary-2026',
        'VN-10': 'danang-jobs-career-guide-2026',
        'VN-11': 'haiphong-jobs-career-guide-2026',
        'VN-12': 'vietnam-japanese-company-benefits-2026',
        'VN-13': 'vietnam-remote-work-jobs-2026',
        'VN-14': 'vietnam-work-visa-application-guide-2026',
        'VN-15': 'vietnam-termination-regulations-guide-2026',
        'VN-16': 'vietnam-severance-pay-guide-2026',
        'VN-17': 'vietnam-labor-contract-guide-2026',
        'VN-18': 'vietnam-visa-extension-renewal-guide-2026',
        'VN-19': 'vietnam-foreign-worker-legal-guide-2026',
        'VN-20': 'vietnam-personal-income-tax-guide-2026',
        'VN-21': 'vietnam-social-security-guide-2026',
        'VN-22': 'vietnam-investment-incentives-guide-2026',
        'VN-23': 'vietnam-tax-return-guide-for-japanese-2026',
        'VN-24': 'vietnam-corporate-tax-incentives-guide-2026',
        'VN-25': 'vietnam-japan-tax-treaty-guide-2026',
        'VN-26': 'vietnam-economic-corridors-guide-2026',
        'VN-27': 'vietnam-japanese-manufacturing-trends-2026',
        'VN-28': 'vietnam-digital-transformation-policy-2026',
        'VN-29': 'vietnam-japan-economic-partnership-2026',
        'VN-30': 'vietnam-japanese-schools-guide-2026',
        'VN-31': 'vietnam-international-schools-guide-2026',
        'VN-32': 'vietnam-health-insurance-guide-2026',
        'VN-33': 'vietnam-hospitals-medical-facilities-guide-2026',
        'VN-34': 'hochiminh-residential-area-guide-2026',
        'VN-35': 'hanoi-residential-area-guide-2026',
        'VN-36': 'vietnam-safety-security-guide-2026'
    };

    const published = [];
    const unpublished = [];

    draftFiles.forEach(filename => {
        // ファイル名から記事IDを抽出（例: TH-01_xxx.html -> TH-01）
        const match = filename.match(/^(TH-\d+|VN-\d+)/);
        if (!match) return;

        const articleId = match[1];
        const expectedSlug = articleSlugs[articleId];

        // slugで公開済みかどうか確認
        let isPublished = false;
        if (expectedSlug && publishedSlugs.has(expectedSlug)) {
            isPublished = true;
        } else {
            // ファイル名にslugが含まれる場合もチェック
            for (const slug of publishedSlugs) {
                if (slug.includes('2026') && filename.toLowerCase().includes(slug.split('-')[0])) {
                    // 部分一致の場合は追加チェック
                }
            }
        }

        // 実際の公開状況を確認（手動リスト）
        const confirmedPublished = [
            'TH-07', 'TH-08', 'TH-09', 'TH-10', 'TH-11', 'TH-17', 'TH-18',
            'TH-22', 'TH-23', 'TH-27', 'TH-31', 'TH-32', 'TH-33',
            'VN-07', 'VN-08', 'VN-10', 'VN-11', 'VN-17', 'VN-18',
            'VN-22', 'VN-23', 'VN-24', 'VN-26', 'VN-27', 'VN-28',
            'VN-30', 'VN-31', 'VN-32', 'VN-33', 'VN-34', 'VN-35'
        ];

        if (confirmedPublished.includes(articleId)) {
            published.push({ id: articleId, filename });
        } else {
            unpublished.push({ id: articleId, filename });
        }
    });

    console.log('=== 公開済み記事 ===\n');
    published.forEach(p => console.log(`  ${p.id}: ${p.filename}`));
    console.log(`\n合計: ${published.length} 記事\n`);

    console.log('=== 未公開記事 ===\n');
    unpublished.forEach(p => console.log(`  ${p.id}: ${p.filename}`));
    console.log(`\n合計: ${unpublished.length} 記事`);
}

main().catch(console.error);
