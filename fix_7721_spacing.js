const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Get current content (raw)
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

        // Find the area around "ここからは、タイへの転職を検討されている求職者向けの情報です"
        const searchText = 'ここからは、タイへの転職を検討されている求職者向けの情報です';
        const pos = content.indexOf(searchText);

        if (pos >= 0) {
            console.log('\n=== BEFORE FIX (around the text) ===');
            console.log(content.substring(pos - 50, pos + 300));
        }

        // Fix: Remove extra newlines/spaces between sections
        // Look for pattern: </p>\n\n\n\n<p> and reduce to </p>\n<p>
        content = content.replace(/(<\/p>)\s*\n\s*\n\s*\n+\s*(<p>)/g, '$1\n$2');

        // Also fix multiple newlines
        content = content.replace(/\n{4,}/g, '\n\n');

        // Check again
        const pos2 = content.indexOf(searchText);
        if (pos2 >= 0) {
            console.log('\n=== AFTER FIX (around the text) ===');
            console.log(content.substring(pos2 - 50, pos2 + 300));
        }

        console.log('\nNew content length:', content.length);

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
