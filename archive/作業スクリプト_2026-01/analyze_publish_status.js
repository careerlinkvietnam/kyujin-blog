const https = require('https');
const fs = require('fs');

const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// 記事ID -> slug/Post IDのマッピング（計画リストより）
const articleMapping = {
    // SS優先度
    'TH-01': { priority: 'SS', title: 'タイ日系企業ランキング2026' },
    'TH-02': { priority: 'SS', title: 'タイ製造業求人完全ガイド' },
    'TH-20': { priority: 'SS', title: 'タイ個人所得税完全ガイド2026' },
    'VN-01': { priority: 'SS', title: 'ベトナム日系企業ランキング2026' },
    'VN-02': { priority: 'SS', title: 'ベトナム製造業求人完全ガイド' },
    'VN-20': { priority: 'SS', title: 'ベトナム個人所得税完全ガイド2026' },

    // S優先度
    'TH-03': { priority: 'S', title: 'タイIT求人・エンジニア転職ガイド' },
    'TH-04': { priority: 'S', title: 'タイ営業職求人ガイド' },
    'TH-05': { priority: 'S', title: 'タイ経理・会計求人ガイド' },
    'TH-06': { priority: 'S', title: 'タイ人事・総務求人ガイド' },
    'TH-14': { priority: 'S', title: 'タイBビザ申請方法2026' },
    'TH-15': { priority: 'S', title: 'タイ解雇規定完全解説' },
    'TH-16': { priority: 'S', title: 'タイ退職金制度完全解説' },
    'TH-21': { priority: 'S', title: 'タイ社会保険制度解説' },
    'TH-25': { priority: 'S', title: 'タイ経済2026年見通し' },
    'TH-29': { priority: 'S', title: 'タイ日本人学校完全ガイド' },
    'TH-30': { priority: 'S', title: 'タイインターナショナルスクールガイド' },
    'VN-03': { priority: 'S', title: 'ベトナムIT求人・エンジニア転職ガイド' },
    'VN-04': { priority: 'S', title: 'ベトナム営業職求人ガイド' },
    'VN-05': { priority: 'S', title: 'ベトナム経理・会計求人ガイド' },
    'VN-06': { priority: 'S', title: 'ベトナム人事・総務求人ガイド' },
    'VN-14': { priority: 'S', title: 'ベトナム就労ビザ申請方法2026' },
    'VN-15': { priority: 'S', title: 'ベトナム解雇規定完全解説' },
    'VN-16': { priority: 'S', title: 'ベトナム退職金制度完全解説' },
    'VN-21': { priority: 'S', title: 'ベトナム社会保険制度解説' },
    'VN-22': { priority: 'S', title: 'ベトナム投資優遇制度2026' },
    'VN-26': { priority: 'S', title: 'ベトナム南北経済回廊と産業動向' },
    'VN-30': { priority: 'S', title: 'ベトナム日本人学校完全ガイド' },
    'VN-31': { priority: 'S', title: 'ベトナムインターナショナルスクールガイド' },

    // A優先度
    'TH-07': { priority: 'A', title: 'タイ転職の年収相場2026' },
    'TH-08': { priority: 'A', title: 'タイ現地採用と駐在員の給料比較' },
    'TH-09': { priority: 'A', title: 'タイコールセンター求人ガイド' },
    'TH-10': { priority: 'A', title: 'チェンマイ求人・就職事情' },
    'TH-11': { priority: 'A', title: 'シラチャ求人・就職事情' },
    'TH-17': { priority: 'A', title: 'タイ労働者保護法の重要ポイント' },
    'TH-18': { priority: 'A', title: 'タイ駐在員のビザ延長・更新ガイド' },
    'TH-22': { priority: 'A', title: 'タイで働く日本人の確定申告ガイド' },
    'TH-23': { priority: 'A', title: 'タイの法人税・税制優遇まとめ' },
    'TH-27': { priority: 'A', title: 'タイ政府のEV政策と産業転換' },
    'TH-31': { priority: 'A', title: 'タイの医療保険完全ガイド' },
    'TH-32': { priority: 'A', title: 'タイの病院・医療機関ガイド' },
    'TH-33': { priority: 'A', title: 'バンコク住居エリアガイド' },
    'VN-07': { priority: 'A', title: 'ベトナム転職の年収相場2026' },
    'VN-08': { priority: 'A', title: 'ベトナム現地採用と駐在員の給料比較' },
    'VN-10': { priority: 'A', title: 'ダナン求人・就職事情' },
    'VN-11': { priority: 'A', title: 'ハイフォン求人・就職事情' },
    'VN-17': { priority: 'A', title: 'ベトナム労働契約の重要ポイント' },
    'VN-18': { priority: 'A', title: 'ベトナム駐在員のビザ延長・更新ガイド' },
    'VN-23': { priority: 'A', title: 'ベトナムで働く日本人の確定申告ガイド' },
    'VN-24': { priority: 'A', title: 'ベトナムの法人税・税制優遇まとめ' },
    'VN-27': { priority: 'A', title: 'ベトナム製造業の日系企業動向2026' },
    'VN-28': { priority: 'A', title: 'ベトナム政府のデジタル化政策' },
    'VN-32': { priority: 'A', title: 'ベトナムの医療保険完全ガイド' },
    'VN-33': { priority: 'A', title: 'ベトナムの病院・医療機関ガイド' },
    'VN-34': { priority: 'A', title: 'ホーチミン住居エリアガイド' },
    'VN-35': { priority: 'A', title: 'ハノイ住居エリアガイド' },

    // B優先度
    'TH-12': { priority: 'B', title: 'タイ日系企業の福利厚生比較' },
    'TH-13': { priority: 'B', title: 'タイでリモートワーク求人' },
    'TH-19': { priority: 'B', title: 'タイで外国人が働く際の法的注意点' },
    'TH-24': { priority: 'B', title: 'タイと日本の租税条約解説' },
    'TH-28': { priority: 'B', title: 'タイ・日本経済連携の最新状況' },
    'TH-34': { priority: 'B', title: 'タイの治安と安全対策2026' },
    'TH-35': { priority: 'B', title: 'チェンマイ生活費ガイド' },
    'VN-12': { priority: 'B', title: 'ベトナム日系企業の福利厚生比較' },
    'VN-13': { priority: 'B', title: 'ベトナムでリモートワーク求人' },
    'VN-19': { priority: 'B', title: 'ベトナムで外国人が働く際の法的注意点' },
    'VN-25': { priority: 'B', title: 'ベトナムと日本の租税条約解説' },
    'VN-29': { priority: 'B', title: 'ベトナム・日本経済連携の最新状況' },
    'VN-36': { priority: 'B', title: 'ベトナムの治安と安全対策2026' }
};

// slug -> 記事IDのマッピング（WordPressのslugから記事IDを特定）
const slugToArticleId = {
    'thailand-japanese-company-ranking-2026': 'TH-01',
    'thailand-manufacturing-job-guide-2026': 'TH-02',
    'thailand-it-job-guide-2026': 'TH-03',
    'thailand-sales-job-guide-2026': 'TH-04',
    'thailand-accounting-job-guide-2026': 'TH-05',
    'thailand-hr-admin-job-guide-2026': 'TH-06',
    'thailand-salary-guide-2026': 'TH-07',
    'thailand-expat-vs-local-hire-salary-2026': 'TH-08',
    'thailand-call-center-jobs-guide-2026': 'TH-09',
    'chiangmai-jobs-career-guide-2026': 'TH-10',
    'sriracha-jobs-career-guide-2026': 'TH-11',
    'thailand-dismissal-regulations-guide-2026': 'TH-15',
    'thailand-severance-pay-guide-2026': 'TH-16',
    'thailand-labor-protection-act-guide-2026': 'TH-17',
    'thailand-visa-extension-renewal-guide-2026': 'TH-18',
    'thailand-personal-income-tax-guide-2026': 'TH-20',
    'thailand-social-security-guide-2026': 'TH-21',
    'thailand-tax-return-guide-for-japanese-2026': 'TH-22',
    'thailand-corporate-tax-boi-incentives-guide-2026': 'TH-23',
    'thailand-economy-outlook-2026': 'TH-25',
    'thailand-ev-policy-automotive-transformation-2026': 'TH-27',
    'thailand-japanese-school-guide-2026': 'TH-29',
    'thailand-international-school-guide-2026': 'TH-30',
    'thailand-health-insurance-guide-2026': 'TH-31',
    'thailand-hospitals-medical-facilities-guide-2026': 'TH-32',
    'bangkok-residential-area-guide-2026': 'TH-33',
    'vietnam-japanese-company-ranking-2026': 'VN-01',
    'vietnam-manufacturing-job-guide-2026': 'VN-02',
    'vietnam-it-job-guide-2026': 'VN-03',
    'vietnam-sales-job-guide-2026': 'VN-04',
    'vietnam-accounting-job-guide-2026': 'VN-05',
    'vietnam-hr-admin-job-guide-2026': 'VN-06',
    'vietnam-salary-guide-2026': 'VN-07',
    'vietnam-expat-vs-local-hire-salary-2026': 'VN-08',
    'danang-jobs-career-guide-2026': 'VN-10',
    'haiphong-jobs-career-guide-2026': 'VN-11',
    'vietnam-dismissal-regulations-guide-2026': 'VN-15',
    'vietnam-severance-pay-guide-2026': 'VN-16',
    'vietnam-labor-contract-guide-2026': 'VN-17',
    'vietnam-visa-extension-renewal-guide-2026': 'VN-18',
    'vietnam-personal-income-tax-guide-2026': 'VN-20',
    'vietnam-social-security-guide-2026': 'VN-21',
    'vietnam-investment-incentives-2026': 'VN-22',
    'vietnam-tax-return-guide-for-japanese-2026': 'VN-23',
    'vietnam-corporate-tax-incentives-guide-2026': 'VN-24',
    'vietnam-economic-corridors-2026': 'VN-26',
    'vietnam-japanese-manufacturing-trends-2026': 'VN-27',
    'vietnam-digital-transformation-policy-2026': 'VN-28',
    'vietnam-japanese-school-guide-2026': 'VN-30',
    'vietnam-international-school-guide-2026': 'VN-31',
    'vietnam-health-insurance-guide-2026': 'VN-32',
    'vietnam-hospitals-medical-facilities-guide-2026': 'VN-33',
    'hochiminh-residential-area-guide-2026': 'VN-34',
    'hanoi-residential-area-guide-2026': 'VN-35'
};

function fetchPosts(page) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: `/blog/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=id,slug,date`,
            method: 'GET',
            headers: { 'Authorization': `Basic ${AUTH}` }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(res.statusCode === 200 ? JSON.parse(data) : []));
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    let allPosts = [];
    for (let page = 1; page <= 5; page++) {
        const posts = await fetchPosts(page);
        if (posts.length === 0) break;
        allPosts = allPosts.concat(posts);
    }

    const publishedSlugs = new Set(allPosts.map(p => p.slug));
    const slugToPostId = {};
    allPosts.forEach(p => { slugToPostId[p.slug] = p.id; });

    const published = { SS: [], S: [], A: [], B: [] };
    const unpublished = { SS: [], S: [], A: [], B: [] };

    Object.entries(articleMapping).forEach(([articleId, info]) => {
        // slugToArticleIdから逆引きしてslugを取得
        const slug = Object.entries(slugToArticleId).find(([s, id]) => id === articleId)?.[0];

        if (slug && publishedSlugs.has(slug)) {
            published[info.priority].push({
                articleId,
                title: info.title,
                postId: slugToPostId[slug],
                slug
            });
        } else {
            unpublished[info.priority].push({ articleId, title: info.title });
        }
    });

    console.log('=== 記事公開状況（正確版）===\\n');

    ['SS', 'S', 'A', 'B'].forEach(priority => {
        console.log(`【${priority}優先度】公開済: ${published[priority].length} / 未公開: ${unpublished[priority].length}`);
        if (published[priority].length > 0) {
            console.log('  公開済:');
            published[priority].forEach(p => console.log(`    ${p.articleId}: ${p.title} (ID:${p.postId})`));
        }
        if (unpublished[priority].length > 0) {
            console.log('  未公開:');
            unpublished[priority].forEach(p => console.log(`    ${p.articleId}: ${p.title}`));
        }
        console.log('');
    });

    const totalPublished = Object.values(published).flat().length;
    const totalUnpublished = Object.values(unpublished).flat().length;
    console.log(`\\n=== サマリー ===`);
    console.log(`公開済み: ${totalPublished} 記事`);
    console.log(`未公開: ${totalUnpublished} 記事`);
    console.log(`合計: ${totalPublished + totalUnpublished} 記事`);
}

main().catch(console.error);
