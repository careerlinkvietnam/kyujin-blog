const https = require('https');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// カテゴリー設定対象（ルールに基づく）
const articlesToUpdate = [
    // ベトナム関連
    { id: 8332, title: 'ベトナム治安と安全対策', categories: [25, 28] },        // ベトナム, 生活情報
    { id: 8331, title: 'ベトナム日本経済連携', categories: [25, 148] },         // ベトナム, ビジネス
    { id: 8330, title: 'ベトナム日本租税条約', categories: [25, 148, 158] },    // ベトナム, ビジネス, 法律
    { id: 8329, title: 'ベトナム外国人労働法的注意点', categories: [25, 148, 158] }, // ベトナム, ビジネス, 法律
    { id: 8328, title: 'ベトナムリモートワーク求人', categories: [25] },        // ベトナム
    { id: 8327, title: 'ベトナム日系企業福利厚生', categories: [25, 148] },     // ベトナム, ビジネス

    // タイ関連
    { id: 8326, title: 'チェンマイ生活費', categories: [26, 219, 28] },         // タイ, チェンマイ, 生活情報
    { id: 8325, title: 'タイ治安と安全対策', categories: [26, 28] },            // タイ, 生活情報
    { id: 8324, title: 'タイ日本経済連携', categories: [26, 148] },             // タイ, ビジネス
    { id: 8323, title: 'タイ日本租税条約', categories: [26, 148, 158] },        // タイ, ビジネス, 法律
    { id: 8322, title: 'タイ外国人労働法的注意点', categories: [26, 148, 158] }, // タイ, ビジネス, 法律
    { id: 8321, title: 'タイリモートワーク求人', categories: [26] },            // タイ

    // 修正：タイ記事なのにベトナムカテゴリーだった
    { id: 8318, title: 'タイ日系企業福利厚生（修正）', categories: [26, 148] }  // タイ, ビジネス
];

function updateCategory(articleId, categories, title) {
    return new Promise((resolve, reject) => {
        const updateData = JSON.stringify({
            categories: categories
        });

        const options = {
            hostname: 'kyujin.careerlink.asia',
            path: `/blog/wp-json/wp/v2/posts/${articleId}`,
            method: 'POST',
            headers: {
                'Authorization': AUTH,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(updateData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.id) {
                        console.log(`SUCCESS: ${title} (ID: ${articleId}) - Categories: [${categories.join(', ')}]`);
                        resolve(response);
                    } else {
                        console.log(`ERROR (${title}):`, data.substring(0, 200));
                        reject(new Error(data));
                    }
                } catch (e) {
                    console.log(`Parse Error (${title}):`, e.message);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`Request Error (${title}):`, e.message);
            reject(e);
        });

        req.write(updateData);
        req.end();
    });
}

async function updateAllCategories() {
    console.log('=== カテゴリー更新開始（13記事） ===\n');
    console.log('カテゴリーID: 25=ベトナム, 26=タイ, 148=ビジネス, 158=法律, 28=生活情報, 219=チェンマイ\n');

    let success = 0;
    let failed = 0;

    for (const article of articlesToUpdate) {
        try {
            await updateCategory(article.id, article.categories, article.title);
            success++;
        } catch (e) {
            failed++;
        }
        // 少し待機
        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\n=== 完了 ===');
    console.log(`成功: ${success}件 / 失敗: ${failed}件`);
}

updateAllCategories();
