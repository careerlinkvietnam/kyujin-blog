const https = require('https');
const fs = require('fs');

const API_BASE = 'kyujin.careerlink.asia';
const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// Post ID -> ローカルファイル名
const articlesToUpdate = {
    8229: 'TH-07_thailand-salary-guide-2026.html',
    8230: 'TH-08_thailand-expat-vs-local-hire-salary.html',
    8231: 'TH-09_thailand-call-center-jobs-guide.html',
    8232: 'TH-10_chiangmai-jobs-career-guide.html',
    8234: 'TH-11_sriracha-jobs-career-guide.html',
    8237: 'TH-18_タイ駐在員ビザ延長更新ガイド.html',
    8238: 'TH-22_タイで働く日本人の確定申告ガイド.html',
    8239: 'TH-23_タイの法人税税制優遇まとめ.html',
    8241: 'TH-27_タイ政府のEV政策と産業転換.html',
    8243: 'TH-31_タイの医療保険完全ガイド.html',
    8244: 'TH-32_タイの病院医療機関ガイド.html',
    8245: 'TH-33_バンコク住居エリアガイド.html',
    8259: 'VN-07_vietnam-salary-guide-2026.html',
    8260: 'VN-08_vietnam-expat-vs-local-hire-salary.html',
    8263: 'VN-17_ベトナム労働契約の重要ポイント.html',
    8269: 'VN-32_ベトナム医療保険完全ガイド.html',
    8270: 'VN-33_ベトナム病院医療機関ガイド.html',
    8271: 'VN-34_ホーチミン住居エリアガイド.html',
    8272: 'VN-35_ハノイ住居エリアガイド.html'
};

function updatePost(postId, content) {
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
            res.on('data', chunk => responseData += chunk);
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

        req.on('error', reject);
        req.setTimeout(120000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('=== CDATA修正: WordPress公開記事の更新 ===\n');

    let successCount = 0;
    let errorCount = 0;

    for (const [postId, filename] of Object.entries(articlesToUpdate)) {
        const filePath = `${DRAFT_FOLDER}/${filename}`;

        if (!fs.existsSync(filePath)) {
            console.log(`[SKIP] ${filename} - ファイルなし`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`[処理中] Post ID ${postId}: ${filename}`);

        try {
            const result = await updatePost(postId, content);
            console.log(`  [成功] ${result.link}`);
            successCount++;
        } catch (err) {
            console.log(`  [エラー] ${err.message}`);
            errorCount++;
        }

        // レート制限対策
        await new Promise(r => setTimeout(r, 1500));
    }

    console.log(`\n=== 完了: 成功 ${successCount} / エラー ${errorCount} ===`);
}

main().catch(console.error);
