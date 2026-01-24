const https = require('https');
const fs = require('fs');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

function fetchArticle(id) {
    return new Promise((resolve, reject) => {
        https.get({
            hostname: 'kyujin.careerlink.asia',
            path: `/blog/wp-json/wp/v2/posts/${id}`,
            headers: { 'Authorization': AUTH }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

function updateArticle(id, content) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ content });
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
                const json = JSON.parse(data);
                resolve(json.id ? { success: true } : { success: false, error: data });
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
                const json = JSON.parse(data);
                resolve(json.id ? { success: true, id: json.id } : { success: false, error: data });
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log('=== Phase 3-2: Updating Hub Articles ===\n');

    // Load B2B sections
    const thB2BSection = fs.readFileSync('draft/b2b-section-thailand.html', 'utf8');
    const vnB2BSection = fs.readFileSync('draft/b2b-section-vietnam.html', 'utf8');

    // Fetch and update Thailand hub (7721)
    const thHub = await fetchArticle(7721);
    let thContent = thHub.content.rendered;

    // Check if B2B section already exists
    if (!thContent.includes('企業の採用担当者様へ')) {
        thContent = thB2BSection + thContent;
        const result1 = await updateArticle(7721, thContent);
        console.log('ID 7721 (TH Hub):', result1.success ? 'B2B section added' : 'Failed');
    } else {
        console.log('ID 7721 (TH Hub): B2B section already exists');
    }

    // Fetch and update Vietnam hub (7726)
    const vnHub = await fetchArticle(7726);
    let vnContent = vnHub.content.rendered;

    if (!vnContent.includes('企業の採用担当者様へ')) {
        vnContent = vnB2BSection + vnContent;
        const result2 = await updateArticle(7726, vnContent);
        console.log('ID 7726 (VN Hub):', result2.success ? 'B2B section added' : 'Failed');
    } else {
        console.log('ID 7726 (VN Hub): B2B section already exists');
    }

    console.log('\n=== Phase 3-3: Creating B2B Hub Articles ===\n');

    // Create Thailand B2B Hub
    const thB2BHub = fs.readFileSync('draft/thailand-recruitment-guide-b2b-hub.html', 'utf8');
    const result3 = await createArticle(
        'タイ人材採用ガイド【企業向け完全版】労務・給与・採用フローまで網羅',
        thB2BHub,
        'thailand-recruitment-guide-for-employers-2026',
        [146]  // タイ転職カテゴリ
    );
    console.log('TH B2B Hub:', result3.success ? `Created (ID: ${result3.id})` : 'Failed');

    // Create Vietnam B2B Hub
    const vnB2BHub = fs.readFileSync('draft/vietnam-recruitment-guide-b2b-hub.html', 'utf8');
    const result4 = await createArticle(
        'ベトナム人材採用ガイド【企業向け完全版】労務・給与・採用フローまで網羅',
        vnB2BHub,
        'vietnam-recruitment-guide-for-employers-2026',
        [147]  // ベトナム転職カテゴリ
    );
    console.log('VN B2B Hub:', result4.success ? `Created (ID: ${result4.id})` : 'Failed');

    console.log('\nPhase 3-2 & 3-3 complete.');
}

main().catch(console.error);
