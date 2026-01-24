const https = require('https');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// カテゴリー設定対象
const articlesToUpdate = [
    { id: 8504, title: '履歴書ガイド', categories: [148] },          // ビジネス
    { id: 8505, title: '面接対策ガイド', categories: [148] },        // ビジネス
    { id: 8506, title: 'タイvsベトナム比較', categories: [26, 25] }, // タイ, ベトナム
    { id: 8510, title: '英語力別ガイド', categories: [148] }         // ビジネス
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
                        console.log(`ERROR (${title}):`, data);
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
    console.log('=== カテゴリー更新開始 ===\n');

    for (const article of articlesToUpdate) {
        await updateCategory(article.id, article.categories, article.title);
        // 少し待機
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n=== 完了 ===');
}

updateAllCategories();
