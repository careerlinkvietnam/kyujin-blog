const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// First, get current content
const getOptions = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts/7721',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(getOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        let content = json.content.rendered;

        console.log('Original content length:', content.length);

        // Fix: Change H4s inside B2B section to divs
        // These are the three category headers in the B2B grid

        // 1. 労務・法務
        const oldH4_1 = '<h4 style="color: #fff; margin-top: 0;">📋 労務・法務</h4>';
        const newDiv_1 = '<div style="color: #fff; margin-top: 0; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">📋 労務・法務</div>';

        // 2. 給与・税務
        const oldH4_2 = '<h4 style="color: #fff; margin-top: 0;">💰 給与・税務</h4>';
        const newDiv_2 = '<div style="color: #fff; margin-top: 0; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">💰 給与・税務</div>';

        // 3. 採用・マネジメント
        const oldH4_3 = '<h4 style="color: #fff; margin-top: 0;">🤝 採用・マネジメント</h4>';
        const newDiv_3 = '<div style="color: #fff; margin-top: 0; font-weight: bold; font-size: 1.1em; margin-bottom: 8px;">🤝 採用・マネジメント</div>';

        let changes = 0;

        if (content.includes(oldH4_1)) {
            content = content.replace(oldH4_1, newDiv_1);
            console.log('Fixed: 労務・法務 H4 -> div');
            changes++;
        }

        if (content.includes(oldH4_2)) {
            content = content.replace(oldH4_2, newDiv_2);
            console.log('Fixed: 給与・税務 H4 -> div');
            changes++;
        }

        if (content.includes(oldH4_3)) {
            content = content.replace(oldH4_3, newDiv_3);
            console.log('Fixed: 採用・マネジメント H4 -> div');
            changes++;
        }

        // Also fix the "この記事でわかること" H3 if it exists
        const oldH3 = '<h3 style="color: #ffd700; margin: 0 0 20px 0; font-size: 1.3em;">この記事でわかること</h3>';
        const newDiv_intro = '<div style="color: #ffd700; margin: 0 0 20px 0; font-size: 1.3em; font-weight: bold;">この記事でわかること</div>';

        if (content.includes(oldH3)) {
            content = content.replace(oldH3, newDiv_intro);
            console.log('Fixed: この記事でわかること H3 -> div');
            changes++;
        }

        console.log('\nTotal changes:', changes);
        console.log('New content length:', content.length);

        if (changes === 0) {
            console.log('No changes made. Exiting.');
            return;
        }

        // Update via API
        const postData = JSON.stringify({ content: content });

        const postOptions = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: '/blog/wp-json/wp/v2/posts/7721',
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        console.log('\nUpdating post 7721...');

        const updateReq = https.request(postOptions, (updateRes) => {
            let updateData = '';
            updateRes.on('data', (chunk) => { updateData += chunk; });
            updateRes.on('end', () => {
                if (updateRes.statusCode === 200) {
                    console.log('SUCCESS! Post 7721 updated.');

                    // Verify
                    const result = JSON.parse(updateData);
                    const hasH4 = result.content.rendered.includes('<h4');
                    const hasH3InIntro = result.content.rendered.includes('この記事でわかること</h3>');

                    console.log('\nVerification:');
                    console.log('- Contains H4 tags:', hasH4);
                    console.log('- Intro has H3:', hasH3InIntro);
                } else {
                    console.log('Error:', updateRes.statusCode);
                    console.log(updateData.substring(0, 500));
                }
            });
        });

        updateReq.on('error', (e) => console.error('Request error:', e));
        updateReq.write(postData);
        updateReq.end();
    });
});

req.end();
