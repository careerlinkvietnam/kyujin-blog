const https = require('https');
const fs = require('fs');

// Load original content from the first fetch
const original = JSON.parse(fs.readFileSync('temp_post_7721.json', 'utf8'));
const originalContent = original.content.rendered;

console.log('Original content length:', originalContent.length, 'chars');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const postData = JSON.stringify({ content: originalContent });

const options = {
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

console.log('Reverting post 7721 to original state...');

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode === 200) {
            const result = JSON.parse(data);
            console.log('SUCCESS! Post 7721 reverted.');
            console.log('Content length:', result.content.rendered.length, 'chars');
        } else {
            console.log('Error:', res.statusCode);
            console.log(data.substring(0, 500));
        }
    });
});

req.on('error', (e) => console.error('Request error:', e));
req.write(postData);
req.end();
