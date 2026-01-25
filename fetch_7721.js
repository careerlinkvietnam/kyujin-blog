const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const options = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts/7721',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        console.log('Title:', json.title.rendered);
        console.log('Content length:', json.content.rendered.length, 'chars');

        // Save full content to file for analysis
        fs.writeFileSync('temp_post_7721.json', JSON.stringify(json, null, 2));
        console.log('Full content saved to temp_post_7721.json');
    });
});

req.end();
