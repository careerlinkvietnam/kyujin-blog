const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const getOptions = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts/7721?context=edit',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(getOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        let content = json.content.raw;

        console.log('Original content length:', content.length);

        // Remove the comment block that's causing spacing issues
        const commentBlock = `<p><!-- タイ転職完全ガイド 改善版 --><br />
<!-- 作成日: 2026-01-20 --><br />
<!-- 目標: 25,000文字以上の包括的ガイド --></p>`;

        if (content.includes(commentBlock)) {
            content = content.replace(commentBlock, '');
            console.log('Removed comment block');
        } else {
            // Try alternative pattern
            const altPattern = /<p><!--\s*タイ転職完全ガイド[^<]*<\/p>/;
            if (altPattern.test(content)) {
                content = content.replace(altPattern, '');
                console.log('Removed comment block (alt pattern)');
            } else {
                console.log('Comment block not found, checking content...');
                const idx = content.indexOf('タイ転職完全ガイド 改善版');
                if (idx >= 0) {
                    console.log('Found at:', idx);
                    console.log(content.substring(idx - 20, idx + 150));
                }
            }
        }

        console.log('New content length:', content.length);

        // Update
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
                    console.log('SUCCESS!');
                } else {
                    console.log('Error:', updateRes.statusCode);
                }
            });
        });

        updateReq.write(postData);
        updateReq.end();
    });
});

req.end();
