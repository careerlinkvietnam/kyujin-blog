const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

async function main() {
    // Fetch the current content
    const getOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7726?context=edit',
        method: 'GET',
        headers: { 'Authorization': `Basic ${auth}` }
    };

    const post = await new Promise((resolve) => {
        const req = https.request(getOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });

    let content = post.content.raw;
    console.log('Original length:', content.length);

    // Find and remove the section
    const startMarker = '<h2>ベトナムの求人を探すなら</h2>';
    const endMarker = '<h3>関連記事</h3>';

    const startPos = content.indexOf(startMarker);
    const endPos = content.indexOf(endMarker);

    if (startPos > -1 && endPos > -1) {
        content = content.substring(0, startPos) + content.substring(endPos);
        console.log('Removed legacy CTA section');
        console.log('New length:', content.length);
    } else {
        console.log('Section not found');
        return;
    }

    // Update the post
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7726',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const result = await new Promise((resolve) => {
        const req = https.request(postOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.write(postData);
        req.end();
    });

    if (result.status === 200) {
        console.log('Post 7726 updated successfully!');
    } else {
        console.log('Error updating post:', result.status);
    }
}

main().catch(console.error);
