const fs = require('fs');
const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

function updatePost(id, content) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ content: content });

        const options = {
            hostname: 'kyujin.careerlink.asia',
            path: `/blog/wp-json/wp/v2/posts/${id}`,
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + auth,
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Updated ID ${id}: Status ${res.statusCode}`);
                resolve();
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function main() {
    // Update Indonesia (ID: 9346)
    const indonesiaContent = fs.readFileSync('draft/indonesia-living-cost-guide-2026.html', 'utf8');
    await updatePost(9346, indonesiaContent);

    // Update Malaysia (ID: 9347)
    const malaysiaContent = fs.readFileSync('draft/malaysia-living-cost-guide-2026.html', 'utf8');
    await updatePost(9347, malaysiaContent);

    // Update Philippines (ID: 9350)
    const philippinesContent = fs.readFileSync('draft/philippines-living-cost-guide-2026.html', 'utf8');
    await updatePost(9350, philippinesContent);

    console.log('All three articles updated with correct point box format.');
}

main().catch(console.error);
