const https = require('https');
const fs = require('fs');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

function fetchRevisions(id) {
    return new Promise((resolve, reject) => {
        https.get({
            hostname: 'kyujin.careerlink.asia',
            path: `/blog/wp-json/wp/v2/posts/${id}/revisions`,
            headers: { 'Authorization': AUTH }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Failed to parse revisions: ' + data));
                }
            });
        }).on('error', reject);
    });
}

function restoreRevision(postId, revisionContent, revisionTitle) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            content: revisionContent,
            title: revisionTitle
        });
        const options = {
            hostname: 'kyujin.careerlink.asia',
            path: `/blog/wp-json/wp/v2/posts/${postId}`,
            method: 'POST',
            headers: {
                'Authorization': AUTH,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.id ? { success: true } : { success: false, error: data });
                } catch (e) {
                    resolve({ success: false, error: data });
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('=== 旧記事復元処理 ===\n');

    const articles = [
        { id: 6992, name: 'タイ人材紹介会社一覧' },
        { id: 6804, name: 'ベトナム人材紹介会社一覧' }
    ];

    for (const article of articles) {
        console.log(`\n--- ID ${article.id}: ${article.name} ---`);

        // リビジョン一覧を取得
        const revisions = await fetchRevisions(article.id);

        if (!Array.isArray(revisions) || revisions.length === 0) {
            console.log(`  リビジョンが見つかりません`);
            continue;
        }

        console.log(`  リビジョン数: ${revisions.length}`);

        // 最新のリビジョン（現在の2026版）をスキップし、その前のリビジョンを探す
        // リビジョンは新しい順に並んでいる
        console.log('\n  リビジョン一覧:');
        revisions.slice(0, 5).forEach((rev, i) => {
            const date = new Date(rev.date).toLocaleString('ja-JP');
            const titleText = rev.title?.rendered || '(no title)';
            console.log(`    ${i}: [${rev.id}] ${date} - ${titleText.substring(0, 50)}`);
        });

        // 2026年更新前のリビジョンを特定（タイトルに2026が含まれないもの）
        const oldRevision = revisions.find(rev => {
            const title = rev.title?.rendered || '';
            return !title.includes('2026') && !title.includes('採用担当者向け');
        });

        if (oldRevision) {
            console.log(`\n  復元対象リビジョン: ${oldRevision.id}`);
            console.log(`  タイトル: ${oldRevision.title?.rendered}`);
            console.log(`  日時: ${new Date(oldRevision.date).toLocaleString('ja-JP')}`);

            // 旧記事の内容をファイルに保存
            const content = oldRevision.content?.rendered || '';
            const title = oldRevision.title?.rendered || '';

            fs.writeFileSync(
                `articles/${article.id}/v旧版_content.html`,
                content,
                'utf8'
            );
            console.log(`  旧版コンテンツを保存: articles/${article.id}/v旧版_content.html`);

            // WordPressに復元
            const result = await restoreRevision(article.id, content, title);
            if (result.success) {
                console.log(`  ✅ WordPress復元完了`);
            } else {
                console.log(`  ❌ 復元失敗: ${result.error?.substring(0, 100)}`);
            }
        } else {
            console.log(`\n  ⚠️ 2026年更新前のリビジョンが見つかりません`);
            console.log(`  手動でリビジョンを確認してください`);
        }
    }

    console.log('\n=== 処理完了 ===');
}

main().catch(console.error);
