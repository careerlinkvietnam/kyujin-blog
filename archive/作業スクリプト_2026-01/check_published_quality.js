const https = require('https');

const AUTH = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// 公開済み記事のPost ID一覧（記事マスター管理より）
const publishedPosts = [
    // SS優先度
    { id: 8113, articleId: 'TH-01', title: 'タイ日系企業ランキング2026' },
    { id: 8115, articleId: 'TH-02', title: 'タイ製造業求人完全ガイド' },
    { id: 8117, articleId: 'TH-20', title: 'タイ個人所得税完全ガイド2026' },
    { id: 8114, articleId: 'VN-01', title: 'ベトナム日系企業ランキング2026' },
    { id: 8116, articleId: 'VN-02', title: 'ベトナム製造業求人完全ガイド' },
    { id: 8118, articleId: 'VN-20', title: 'ベトナム個人所得税完全ガイド2026' },
    // S優先度
    { id: 8119, articleId: 'TH-03', title: 'タイIT求人・エンジニア転職ガイド' },
    { id: 8120, articleId: 'TH-04', title: 'タイ営業職求人ガイド' },
    { id: 8121, articleId: 'TH-05', title: 'タイ経理・会計求人ガイド' },
    { id: 8122, articleId: 'TH-06', title: 'タイ人事・総務求人ガイド' },
    { id: 8128, articleId: 'TH-15', title: 'タイ解雇規定完全解説' },
    { id: 8129, articleId: 'TH-16', title: 'タイ退職金制度完全解説' },
    { id: 8130, articleId: 'TH-21', title: 'タイ社会保険制度解説' },
    { id: 8131, articleId: 'TH-25', title: 'タイ経済2026年見通し' },
    { id: 8132, articleId: 'TH-29', title: 'タイ日本人学校完全ガイド' },
    { id: 8133, articleId: 'TH-30', title: 'タイインターナショナルスクールガイド' },
    { id: 8123, articleId: 'VN-03', title: 'ベトナムIT求人・エンジニア転職ガイド' },
    { id: 8124, articleId: 'VN-04', title: 'ベトナム営業職求人ガイド' },
    { id: 8125, articleId: 'VN-05', title: 'ベトナム経理・会計求人ガイド' },
    { id: 8126, articleId: 'VN-06', title: 'ベトナム人事・総務求人ガイド' },
    { id: 8135, articleId: 'VN-15', title: 'ベトナム解雇規定完全解説' },
    { id: 8136, articleId: 'VN-16', title: 'ベトナム退職金制度完全解説' },
    { id: 8137, articleId: 'VN-21', title: 'ベトナム社会保険制度解説' },
    { id: 8138, articleId: 'VN-22', title: 'ベトナム投資優遇制度2026' },
    { id: 8139, articleId: 'VN-26', title: 'ベトナム南北経済回廊と産業動向' },
    { id: 8140, articleId: 'VN-30', title: 'ベトナム日本人学校完全ガイド' },
    { id: 8141, articleId: 'VN-31', title: 'ベトナムインターナショナルスクールガイド' },
    // A優先度
    { id: 8229, articleId: 'TH-07', title: 'タイ転職の年収相場2026' },
    { id: 8230, articleId: 'TH-08', title: 'タイ現地採用と駐在員の給料比較' },
    { id: 8231, articleId: 'TH-09', title: 'タイコールセンター求人ガイド' },
    { id: 8232, articleId: 'TH-10', title: 'チェンマイ求人・就職事情' },
    { id: 8234, articleId: 'TH-11', title: 'シラチャ求人・就職事情' },
    { id: 8236, articleId: 'TH-17', title: 'タイ労働者保護法の重要ポイント' },
    { id: 8237, articleId: 'TH-18', title: 'タイ駐在員のビザ延長・更新ガイド' },
    { id: 8238, articleId: 'TH-22', title: 'タイで働く日本人の確定申告ガイド' },
    { id: 8239, articleId: 'TH-23', title: 'タイの法人税・税制優遇まとめ' },
    { id: 8241, articleId: 'TH-27', title: 'タイ政府のEV政策と産業転換' },
    { id: 8243, articleId: 'TH-31', title: 'タイの医療保険完全ガイド' },
    { id: 8244, articleId: 'TH-32', title: 'タイの病院・医療機関ガイド' },
    { id: 8245, articleId: 'TH-33', title: 'バンコク住居エリアガイド' },
    { id: 8259, articleId: 'VN-07', title: 'ベトナム転職の年収相場2026' },
    { id: 8260, articleId: 'VN-08', title: 'ベトナム現地採用と駐在員の給料比較' },
    { id: 8261, articleId: 'VN-10', title: 'ダナン求人・就職事情' },
    { id: 8262, articleId: 'VN-11', title: 'ハイフォン求人・就職事情' },
    { id: 8263, articleId: 'VN-17', title: 'ベトナム労働契約の重要ポイント' },
    { id: 8264, articleId: 'VN-18', title: 'ベトナム駐在員のビザ延長・更新ガイド' },
    { id: 8265, articleId: 'VN-23', title: 'ベトナムで働く日本人の確定申告ガイド' },
    { id: 8266, articleId: 'VN-24', title: 'ベトナムの法人税・税制優遇まとめ' },
    { id: 8267, articleId: 'VN-27', title: 'ベトナム製造業の日系企業動向2026' },
    { id: 8268, articleId: 'VN-28', title: 'ベトナム政府のデジタル化政策' },
    { id: 8269, articleId: 'VN-32', title: 'ベトナムの医療保険完全ガイド' },
    { id: 8270, articleId: 'VN-33', title: 'ベトナムの病院・医療機関ガイド' },
    { id: 8271, articleId: 'VN-34', title: 'ホーチミン住居エリアガイド' },
    { id: 8272, articleId: 'VN-35', title: 'ハノイ住居エリアガイド' }
];

function fetchPost(postId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: `/blog/wp-json/wp/v2/posts/${postId}?_fields=id,content`,
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
                    resolve(null);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

function checkContent(content) {
    const issues = [];

    // 1. HTMLドキュメント構造チェック
    if (content.includes('<!DOCTYPE') || content.includes('<html')) {
        issues.push('HTMLドキュメント構造あり');
    }

    // 2. CDATAタグチェック
    if (content.includes('<![CDATA[') || content.includes(']]>')) {
        issues.push('CDATAタグあり');
    }

    // 3. h1タグチェック
    if (/<h1[^>]*>/i.test(content)) {
        issues.push('h1タグあり');
    }

    // 4. CTAリンクチェック
    if (!content.includes('/jobseeker/register')) {
        issues.push('CTAリンクなし');
    }

    // 5. 関連記事セクションチェック
    if (!content.includes('関連記事')) {
        issues.push('関連記事なし');
    }

    return issues;
}

async function main() {
    console.log('=== 公開済み54記事 品質チェック ===\n');
    console.log('WordPress APIから記事を取得中...\n');

    const problemArticles = [];
    let okCount = 0;

    for (const post of publishedPosts) {
        const data = await fetchPost(post.id);
        if (!data) {
            console.log(`[ERROR] ${post.articleId}: 取得失敗 (ID:${post.id})`);
            continue;
        }

        const content = data.content.rendered || '';
        const issues = checkContent(content);

        if (issues.length > 0) {
            console.log(`[NG] ${post.articleId}: ${post.title}`);
            issues.forEach(issue => console.log(`     - ${issue}`));
            problemArticles.push({ ...post, issues });
        } else {
            okCount++;
        }
    }

    console.log('\n=== 結果 ===');
    console.log(`問題なし: ${okCount}件`);
    console.log(`問題あり: ${problemArticles.length}件`);

    if (problemArticles.length > 0) {
        console.log('\n=== 問題のある記事一覧 ===');
        problemArticles.forEach(p => {
            console.log(`${p.articleId} (ID:${p.id}): ${p.issues.join(', ')}`);
        });
    }
}

main().catch(console.error);
