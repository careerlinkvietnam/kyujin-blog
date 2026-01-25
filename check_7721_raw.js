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

        console.log('=== RAW CONTENT (content.raw) ===');
        if (json.content && json.content.raw) {
            const raw = json.content.raw;
            console.log('Raw content length:', raw.length);

            // Check for [toc] shortcode
            const hasToc = raw.includes('[toc');
            console.log('Contains [toc] shortcode:', hasToc);

            if (hasToc) {
                const tocPos = raw.indexOf('[toc');
                console.log('\n=== AREA AROUND [toc] ===');
                console.log(raw.substring(Math.max(0, tocPos - 100), tocPos + 150));
            }

            // Show area after HR
            const hrPos = raw.indexOf('<hr');
            if (hrPos >= 0) {
                console.log('\n=== AREA AFTER <hr> ===');
                console.log(raw.substring(hrPos, hrPos + 400));
            }
        } else {
            console.log('No raw content available');
            console.log('Available fields:', Object.keys(json.content || {}));
        }
    });
});

req.end();
