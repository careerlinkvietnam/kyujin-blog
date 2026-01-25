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

        // Find the position after the <hr> tag that separates B2B section from content
        // The HR tag: <hr style="margin: 40px 0; border: none; border-top: 2px solid #eee;">
        const hrTag = '<hr style="margin: 40px 0; border: none; border-top: 2px solid #eee;">';
        const hrPos = content.indexOf(hrTag);

        if (hrPos === -1) {
            console.log('ERROR: Could not find HR separator');
            return;
        }

        console.log('Found HR at position:', hrPos);

        // Insert [toc] shortcode right after the HR tag
        const insertPos = hrPos + hrTag.length;
        const tocShortcode = '\n\n[toc heading_levels="2,3"]\n\n';

        content = content.substring(0, insertPos) + tocShortcode + content.substring(insertPos);

        console.log('Inserted [toc] shortcode at position:', insertPos);
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
                    const result = JSON.parse(updateData);

                    // Verify the shortcode is in the content
                    const hasToc = result.content.rendered.includes('[toc');
                    console.log('Contains [toc] shortcode:', hasToc);

                    // Show the area around the insertion
                    const newHrPos = result.content.rendered.indexOf(hrTag);
                    console.log('\n=== AREA AROUND INSERTION ===');
                    console.log(result.content.rendered.substring(newHrPos, newHrPos + 300));
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
