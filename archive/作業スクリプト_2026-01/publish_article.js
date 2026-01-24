const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'kyujin.careerlink.asia';
const API_PATH = '/blog/wp-json/wp/v2/posts';
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// カテゴリーID一覧
// 国・地域: タイ(26), ベトナム(25)
// 都市: バンコク(15), チェンマイ(219), ホーチミン(4), ハノイ(14), ダナン(141)
// トピック: ビジネス(148), 法律(158), 採用・雇用(273), 投資(530), 生活情報(28)

// Article metadata: prefix -> { title, slug, categories, tags }
const articles = {
    'TH-07': {
        title: 'タイ転職の年収相場2026年版｜職種別・経験年数別の給与完全ガイド',
        slug: 'thailand-salary-guide-2026',
        categories: [26],  // タイ
        tags: []
    },
    'TH-08': {
        title: 'タイ現地採用と駐在員の給料比較｜年収・手当・待遇の違いを徹底解説【2026年版】',
        slug: 'thailand-expat-vs-local-hire-salary-2026',
        categories: [26],  // タイ
        tags: []
    },
    'TH-09': {
        title: 'タイでコールセンター求人ガイド｜給料・仕事内容・キャリアパスを徹底解説【2026年版】',
        slug: 'thailand-call-center-jobs-guide-2026',
        categories: [26],  // タイ
        tags: []
    },
    'TH-10': {
        title: 'チェンマイ求人・転職完全ガイド｜日本人向け仕事・生活情報【2026年版】',
        slug: 'chiangmai-jobs-career-guide-2026',
        categories: [26, 219],  // タイ, チェンマイ
        tags: []
    },
    'TH-11': {
        title: 'シラチャ求人・転職完全ガイド｜日本人向け仕事・生活情報【2026年版】',
        slug: 'sriracha-jobs-career-guide-2026',
        categories: [26],  // タイ
        tags: []
    },
    'TH-17': {
        title: 'タイ労働者保護法の重要ポイント完全解説2026｜2025年12月施行の最新改正対応',
        slug: 'thailand-labor-protection-act-guide-2026',
        categories: [26, 148, 158],  // タイ, ビジネス, 法律
        tags: []
    },
    'TH-18': {
        title: 'タイ駐在員のビザ延長・更新完全ガイド【2026年最新版】',
        slug: 'thailand-visa-extension-renewal-guide-2026',
        categories: [26, 148, 158],  // タイ, ビジネス, 法律
        tags: []
    },
    'TH-22': {
        title: 'タイで働く日本人の確定申告完全ガイド【2026年最新版】',
        slug: 'thailand-tax-return-guide-for-japanese-2026',
        categories: [26, 148],  // タイ, ビジネス
        tags: []
    },
    'TH-23': {
        title: 'タイの法人税・税制優遇制度完全ガイド【2026年最新版】',
        slug: 'thailand-corporate-tax-boi-incentives-guide-2026',
        categories: [26, 148],  // タイ, ビジネス
        tags: []
    },
    'TH-27': {
        title: 'タイ政府のEV政策と自動車産業の転換期【2026年最新版】',
        slug: 'thailand-ev-policy-automotive-transformation-2026',
        categories: [26, 148],  // タイ, ビジネス
        tags: []
    },
    'TH-31': {
        title: 'タイの医療保険完全ガイド｜社会保険・民間保険・選び方【2026年最新版】',
        slug: 'thailand-health-insurance-guide-2026',
        categories: [26, 28],  // タイ, 生活情報
        tags: []
    },
    'TH-32': {
        title: 'タイの病院・医療機関ガイド｜日本語対応・JCI認証病院一覧【2026年最新版】',
        slug: 'thailand-hospitals-medical-facilities-guide-2026',
        categories: [26, 28],  // タイ, 生活情報
        tags: []
    },
    'TH-33': {
        title: 'バンコク住居エリア完全ガイド｜日本人に人気のエリア・家賃相場【2026年最新版】',
        slug: 'bangkok-residential-area-guide-2026',
        categories: [26, 15, 28],  // タイ, バンコク, 生活情報
        tags: []
    },
    'VN-07': {
        title: 'ベトナム転職の年収相場2026年版｜職種別・経験年数別の給与完全ガイド',
        slug: 'vietnam-salary-guide-2026',
        categories: [25],  // ベトナム
        tags: []
    },
    'VN-08': {
        title: 'ベトナム現地採用と駐在員の給料比較｜年収・手当・待遇の違いを徹底解説【2026年版】',
        slug: 'vietnam-expat-vs-local-hire-salary-2026',
        categories: [25],  // ベトナム
        tags: []
    },
    'VN-10': {
        title: 'ダナンの求人・就職事情完全ガイド2026｜IT特区で急成長するベトナム第3の都市',
        slug: 'danang-jobs-career-guide-2026',
        categories: [25, 141],  // ベトナム, ダナン
        tags: []
    },
    'VN-11': {
        title: 'ハイフォンの求人・就職事情完全ガイド2026｜ベトナム北部最大の港湾都市で働く',
        slug: 'haiphong-jobs-career-guide-2026',
        categories: [25],  // ベトナム
        tags: []
    },
    'VN-17': {
        title: 'ベトナム労働契約の重要ポイント完全ガイド【2026年最新版】',
        slug: 'vietnam-labor-contract-guide-2026',
        categories: [25, 148, 158],  // ベトナム, ビジネス, 法律
        tags: []
    },
    'VN-18': {
        title: 'ベトナム駐在員のビザ延長・更新完全ガイド【2026年最新版】',
        slug: 'vietnam-visa-extension-renewal-guide-2026',
        categories: [25, 148, 158],  // ベトナム, ビジネス, 法律
        tags: []
    },
    'VN-23': {
        title: 'ベトナムで働く日本人の確定申告完全ガイド【2026年最新版】',
        slug: 'vietnam-tax-return-guide-for-japanese-2026',
        categories: [25, 148],  // ベトナム, ビジネス
        tags: []
    },
    'VN-24': {
        title: 'ベトナムの法人税・税制優遇制度完全ガイド【2026年最新版】',
        slug: 'vietnam-corporate-tax-incentives-guide-2026',
        categories: [25, 148],  // ベトナム, ビジネス
        tags: []
    },
    'VN-27': {
        title: 'ベトナム製造業の日系企業動向2026｜チャイナプラスワンの最前線',
        slug: 'vietnam-japanese-manufacturing-trends-2026',
        categories: [25, 148],  // ベトナム, ビジネス
        tags: []
    },
    'VN-28': {
        title: 'ベトナム政府のデジタル化政策2026｜デジタル経済・電子政府・スマートシティの最新動向',
        slug: 'vietnam-digital-transformation-policy-2026',
        categories: [25, 148],  // ベトナム, ビジネス
        tags: []
    },
    'VN-32': {
        title: 'ベトナムの医療保険完全ガイド｜社会保険・民間保険・選び方【2026年最新版】',
        slug: 'vietnam-health-insurance-guide-2026',
        categories: [25, 28],  // ベトナム, 生活情報
        tags: []
    },
    'VN-33': {
        title: 'ベトナムの病院・医療機関ガイド｜日本語対応病院一覧【2026年最新版】',
        slug: 'vietnam-hospitals-medical-facilities-guide-2026',
        categories: [25, 28],  // ベトナム, 生活情報
        tags: []
    },
    'VN-34': {
        title: 'ホーチミン住居エリア完全ガイド｜日本人に人気のエリア・家賃相場【2026年最新版】',
        slug: 'hochiminh-residential-area-guide-2026',
        categories: [25, 4, 28],  // ベトナム, ホーチミン, 生活情報
        tags: []
    },
    'VN-35': {
        title: 'ハノイ住居エリア完全ガイド｜日本人に人気のエリア・家賃相場【2026年最新版】',
        slug: 'hanoi-residential-area-guide-2026',
        categories: [25, 14, 28],  // ベトナム, ハノイ, 生活情報
        tags: []
    }
};

function createPost(title, content, slug, categories, tags, status = 'publish') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            title: title,
            content: content,
            slug: slug,
            status: status,
            categories: categories,
            tags: tags
        });

        const options = {
            hostname: API_BASE,
            port: 443,
            path: API_PATH,
            method: 'POST',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode === 201) {
                    const response = JSON.parse(responseData);
                    resolve({ success: true, id: response.id, link: response.link });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 500)}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.setTimeout(120000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.write(data);
        req.end();
    });
}

function updatePost(postId, categories) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ categories: categories });

        const options = {
            hostname: API_BASE,
            port: 443,
            path: `/blog/wp-json/wp/v2/posts/${postId}`,
            method: 'POST',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(responseData);
                    resolve({ success: true, id: response.id, categories: response.categories });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 200)}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function findFileForPrefix(prefix) {
    const files = fs.readdirSync(DRAFT_FOLDER);
    return files.find(f => f.startsWith(prefix + '_') && f.endsWith('.html'));
}

async function main() {
    const command = process.argv[2];

    if (!command) {
        console.log('Usage:');
        console.log('  node publish_article.js <PREFIX>          # Publish article');
        console.log('  node publish_article.js update <ID> <CAT> # Update categories');
        console.log('Example:');
        console.log('  node publish_article.js TH-07');
        console.log('  node publish_article.js update 8232 26,219');
        console.log('\nAvailable articles:');
        Object.keys(articles).forEach(p => console.log(`  ${p}: ${articles[p].title}`));
        return;
    }

    // Update existing post categories
    if (command === 'update') {
        const postId = process.argv[3];
        const cats = process.argv[4].split(',').map(Number);
        console.log(`Updating post ${postId} with categories: ${cats}`);
        try {
            const result = await updatePost(postId, cats);
            console.log(`Updated! Categories: ${result.categories}`);
        } catch (err) {
            console.log(`Error: ${err.message}`);
        }
        return;
    }

    // Publish new article
    const prefix = command;
    const articleMeta = articles[prefix];
    if (!articleMeta) {
        console.log(`Error: No metadata found for prefix ${prefix}`);
        return;
    }

    const filename = await findFileForPrefix(prefix);
    if (!filename) {
        console.log(`Error: No file found for prefix ${prefix}`);
        return;
    }

    const filePath = path.join(DRAFT_FOLDER, filename);
    console.log(`Publishing ${prefix}: ${articleMeta.title}`);
    console.log(`File: ${filename}`);
    console.log(`Slug: ${articleMeta.slug}`);
    console.log(`Categories: ${articleMeta.categories}`);

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`Content length: ${content.length} chars`);
        console.log('Sending to WordPress...');

        const result = await createPost(
            articleMeta.title,
            content,
            articleMeta.slug,
            articleMeta.categories,
            articleMeta.tags
        );

        console.log('\n==========================================');
        console.log('SUCCESS!');
        console.log(`Post ID: ${result.id}`);
        console.log(`URL: ${result.link}`);
        console.log('==========================================');
    } catch (err) {
        console.log(`ERROR: ${err.message}`);
    }
}

main().catch(console.error);
