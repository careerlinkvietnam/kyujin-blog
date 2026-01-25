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

        // Remove the existing [toc] shortcode
        content = content.replace(/\n*\[toc[^\]]*\]\n*/g, '');
        console.log('Removed existing [toc] shortcode');

        // Add [toc] at the very beginning of the article
        const tocShortcode = '[toc heading_levels="2,3"]\n\n';
        content = tocShortcode + content;

        console.log('Added [toc] at the beginning');
        console.log('New content length:', content.length);

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

                    // Show first 500 chars
                    const result = JSON.parse(updateData);
                    console.log('\n=== FIRST 500 CHARS ===');
                    console.log(result.content.rendered.substring(0, 500));
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
