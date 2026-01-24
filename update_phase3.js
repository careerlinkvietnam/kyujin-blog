const https = require('https');
const fs = require('fs');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

function updateArticle(id, content, title) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ content, title });
        const options = {
            hostname: 'kyujin.careerlink.asia',
            path: `/blog/wp-json/wp/v2/posts/${id}`,
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
                    resolve(json.id ? { success: true, id: json.id } : { success: false, error: data });
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

function createArticle(title, content, slug, categories) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            title,
            content,
            slug,
            status: 'publish',
            categories
        });
        const options = {
            hostname: 'kyujin.careerlink.asia',
            path: '/blog/wp-json/wp/v2/posts',
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
                    resolve(json.id ? { success: true, id: json.id, link: json.link } : { success: false, error: data });
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('=== Phase 3-1: Updating 6992 and 6804 ===\n');

    // Update Thailand recruitment agency article
    const thContent = fs.readFileSync('draft/thailand-recruitment-agency-2026.html', 'utf8');
    const result1 = await updateArticle(6992, thContent, '【2026年最新】タイの人材紹介会社一覧｜採用担当者向け完全ガイド');
    console.log('ID 6992:', result1.success ? 'Updated' : 'Failed');

    // Update Vietnam recruitment agency article
    const vnContent = fs.readFileSync('draft/vietnam-recruitment-agency-2026.html', 'utf8');
    const result2 = await updateArticle(6804, vnContent, '【2026年最新】ベトナムの人材紹介会社一覧｜採用担当者向け完全ガイド');
    console.log('ID 6804:', result2.success ? 'Updated' : 'Failed');

    console.log('\nPhase 3-1 complete.');
}

main().catch(console.error);
