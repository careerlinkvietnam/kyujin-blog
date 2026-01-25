const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// First, get the current content
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

        // Fix the URL
        const oldUrl = 'https://kyujin.careerlink.asia/jobseeker/register';
        const newUrl = 'https://kyujin.careerlink.asia/register';

        const count = (content.match(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        console.log('Found occurrences:', count);

        if (count > 0) {
            content = content.split(oldUrl).join(newUrl);

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

            const updateReq = https.request(postOptions, (updateRes) => {
                let updateData = '';
                updateRes.on('data', (chunk) => { updateData += chunk; });
                updateRes.on('end', () => {
                    if (updateRes.statusCode === 200) {
                        console.log('Post 7721 updated successfully');
                    } else {
                        console.log('Error:', updateRes.statusCode);
                    }
                });
            });
            updateReq.write(postData);
            updateReq.end();
        } else {
            console.log('URL not found in post 7721 - may already be correct');
        }
    });
});
req.end();
