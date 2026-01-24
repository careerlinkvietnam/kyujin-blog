const https = require('https');
const fs = require('fs');

const AUTH = 'Basic ' + Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const content = fs.readFileSync('C:/Users/siank/Desktop/ClaueCode/draft/thailand-vs-vietnam-job-comparison-2026.html', 'utf8');

const postData = JSON.stringify({
    title: 'タイvsベトナム転職徹底比較【2026年最新】10項目で完全比較',
    content: content,
    status: 'publish',
    slug: 'thailand-vs-vietnam-job-comparison-2026'
});

const options = {
    hostname: 'kyujin.careerlink.asia',
    path: '/blog/wp-json/wp/v2/posts',
    method: 'POST',
    headers: {
        'Authorization': AUTH,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.id) {
                console.log('SUCCESS: Post ID =', response.id);
                console.log('URL:', response.link);
            } else {
                console.log('ERROR:', data);
            }
        } catch (e) {
            console.log('Parse Error:', e.message);
            console.log('Response:', data);
        }
    });
});

req.on('error', (e) => {
    console.log('Request Error:', e.message);
});

req.write(postData);
req.end();
