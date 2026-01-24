const https = require('https');
const fs = require('fs');

const API_BASE = 'kyujin.careerlink.asia';
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// 修正が必要な公開済み記事 (Post ID -> ファイル名)
const articlesToFix = {
    8236: 'TH-17_タイ労働者保護法重要ポイント.html',
    8261: 'VN-10_danang-jobs-career-guide.html',
    8262: 'VN-11_haiphong-jobs-career-guide.html',
    8264: 'VN-18_ベトナム駐在員ビザ延長更新ガイド.html',
    8265: 'VN-23_ベトナムで働く日本人の確定申告ガイド.html',
    8266: 'VN-24_ベトナムの法人税税制優遇まとめ.html',
    8267: 'VN-27_ベトナム製造業の日系企業動向2026.html',
    8268: 'VN-28_ベトナム政府のデジタル化政策.html'
};

function updatePostContent(postId, content) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ content: content });

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
                    try {
                        const response = JSON.parse(responseData);
                        resolve({ success: true, id: response.id, link: response.link });
                    } catch (e) {
                        reject(new Error(`Parse error: ${responseData.substring(0, 200)}`));
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 300)}`));
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

async function main() {
    console.log('=== TOC修正: 公開済み記事のコンテンツ更新 ===\n');

    for (const [postId, filename] of Object.entries(articlesToFix)) {
        const filePath = `${DRAFT_FOLDER}/${filename}`;

        if (!fs.existsSync(filePath)) {
            console.log(`[SKIP] ${filename} - ファイルが見つかりません`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`[処理中] Post ID ${postId}: ${filename}`);
        console.log(`  コンテンツ長: ${content.length} 文字`);

        try {
            const result = await updatePostContent(postId, content);
            console.log(`  [成功] ${result.link}\n`);
        } catch (err) {
            console.log(`  [エラー] ${err.message}\n`);
        }

        // レート制限対策で少し待機
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log('\n=== 処理完了 ===');
}

main().catch(console.error);
