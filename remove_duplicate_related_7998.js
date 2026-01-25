const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

async function main() {
    // Fetch
    const getOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7998?context=edit',
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

    // Find the HTML-encoded 関連記事 section (&#x95A2;&#x9023;&#x8A18;&#x4E8B;)
    const encodedMarker = '&#x95A2;&#x9023;&#x8A18;&#x4E8B;';
    const idx = content.indexOf(encodedMarker);

    if (idx > -1) {
        // Find the h2 tag before it
        const h2Start = content.lastIndexOf('<h2>', idx);
        // Find the end of the ul list after it
        const ulEnd = content.indexOf('</ul>', idx) + 5;

        if (h2Start > -1 && ulEnd > h2Start) {
            console.log('Found encoded 関連記事 section from', h2Start, 'to', ulEnd);
            console.log('Preview:', content.substring(h2Start, Math.min(h2Start + 100, ulEnd)));
            content = content.substring(0, h2Start) + content.substring(ulEnd);
            console.log('Removed duplicate 関連記事 section');
        }
    } else {
        console.log('Encoded 関連記事 not found');
    }

    console.log('New length:', content.length);

    // Verify
    const remaining = (content.match(/関連記事/g) || []).length;
    console.log('Remaining 関連記事 occurrences:', remaining);

    // Update
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7998',
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
            res.on('end', () => resolve({ status: res.statusCode }));
        });
        req.write(postData);
        req.end();
    });

    if (result.status === 200) {
        console.log('Updated successfully');
    } else {
        console.log('Error:', result.status);
    }
}

main();
