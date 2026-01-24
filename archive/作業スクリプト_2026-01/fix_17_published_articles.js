const https = require('https');
const fs = require('fs');
const path = require('path');

const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const DRAFT_FOLDER = 'C:/Users/siank/Desktop/ClaueCode/draft';

// 問題のある17記事のマッピング
const articlesToFix = [
    { postId: 8119, articleId: 'TH-03', file: 'TH-03_タイIT求人エンジニア転職ガイド.html' },
    { postId: 8120, articleId: 'TH-04', file: 'TH-04_タイ営業職求人ガイド.html' },
    { postId: 8121, articleId: 'TH-05', file: 'TH-05_タイ経理会計求人ガイド.html' },
    { postId: 8122, articleId: 'TH-06', file: 'TH-06_タイ人事総務求人ガイド.html' },
    { postId: 8128, articleId: 'TH-15', file: 'TH-15_タイ解雇規定完全解説.html' },
    { postId: 8129, articleId: 'TH-16', file: 'TH-16_タイ退職金制度完全解説.html' },
    { postId: 8130, articleId: 'TH-21', file: 'TH-21_タイ社会保険制度解説.html' },
    { postId: 8131, articleId: 'TH-25', file: 'TH-25_タイ経済2026年見通し.html' },
    { postId: 8132, articleId: 'TH-29', file: 'TH-29_タイ日本人学校完全ガイド.html' },
    { postId: 8133, articleId: 'TH-30', file: 'TH-30_タイインターナショナルスクールガイド.html' },
    { postId: 8123, articleId: 'VN-03', file: 'VN-03_ベトナムIT求人エンジニア転職ガイド.html' },
    { postId: 8124, articleId: 'VN-04', file: 'VN-04_ベトナム営業職求人ガイド.html' },
    { postId: 8125, articleId: 'VN-05', file: 'VN-05_ベトナム経理会計求人ガイド.html' },
    { postId: 8126, articleId: 'VN-06', file: 'VN-06_ベトナム人事総務求人ガイド.html' },
    { postId: 8135, articleId: 'VN-15', file: 'VN-15_ベトナム解雇規定完全解説.html' },
    { postId: 8136, articleId: 'VN-16', file: 'VN-16_ベトナム退職金制度完全解説.html' },
    { postId: 8137, articleId: 'VN-21', file: 'VN-21_ベトナム社会保険制度解説.html' }
];

function updatePost(postId, content) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ content: content });
        const options = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: `/blog/wp-json/wp/v2/posts/${postId}`,
            method: 'POST',
            headers: {
                'Authorization': `Basic ${AUTH}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ success: true, postId });
                } else {
                    resolve({ success: false, postId, error: `HTTP ${res.statusCode}` });
                }
            });
        });
        req.on('error', (e) => resolve({ success: false, postId, error: e.message }));
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('=== 公開済み17記事の修正 ===\n');
    console.log('ドラフトファイルからWordPressを更新中...\n');

    let successCount = 0;
    let failCount = 0;

    for (const article of articlesToFix) {
        const filePath = path.join(DRAFT_FOLDER, article.file);

        if (!fs.existsSync(filePath)) {
            console.log(`[SKIP] ${article.articleId}: ファイルなし - ${article.file}`);
            failCount++;
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const result = await updatePost(article.postId, content);

        if (result.success) {
            console.log(`[OK] ${article.articleId} (ID:${article.postId}): 更新完了`);
            successCount++;
        } else {
            console.log(`[NG] ${article.articleId} (ID:${article.postId}): ${result.error}`);
            failCount++;
        }
    }

    console.log('\n=== 結果 ===');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${failCount}件`);
}

main().catch(console.error);
