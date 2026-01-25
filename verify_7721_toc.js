const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const options = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts/7721?context=edit',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        const raw = json.content.raw;

        console.log('=== FIRST 300 CHARS OF RAW CONTENT ===');
        console.log(raw.substring(0, 300));

        const hasToc = raw.includes('[toc');
        console.log('\nContains [toc]:', hasToc);

        if (hasToc) {
            const pos = raw.indexOf('[toc');
            console.log('[toc] position:', pos);
        }
    });
});

req.end();
