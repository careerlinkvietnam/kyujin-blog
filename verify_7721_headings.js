const https = require('https');

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
        const content = json.content.rendered;

        // Find all H3 and H4 tags
        const h3Matches = content.match(/<h3[^>]*>.*?<\/h3>/gi) || [];
        const h4Matches = content.match(/<h4[^>]*>.*?<\/h4>/gi) || [];

        console.log('=== H3 TAGS FOUND ===');
        h3Matches.forEach((m, i) => {
            const pos = content.indexOf(m);
            const percent = ((pos / content.length) * 100).toFixed(1);
            console.log(`${i+1}. [${percent}%] ${m.substring(0, 80)}`);
        });

        console.log('\n=== H4 TAGS FOUND ===');
        h4Matches.forEach((m, i) => {
            const pos = content.indexOf(m);
            const percent = ((pos / content.length) * 100).toFixed(1);
            console.log(`${i+1}. [${percent}%] ${m.substring(0, 80)}`);
        });

        // Check B2B section specifically
        console.log('\n=== B2B SECTION CHECK ===');
        const b2bStart = content.indexOf('<div class="b2b-section"');
        const b2bEnd = content.indexOf('</div>', content.indexOf('採用のご相談はこちら')) + 6;
        const b2bContent = content.substring(b2bStart, b2bEnd + 100);

        const b2bH3 = b2bContent.match(/<h3/gi) || [];
        const b2bH4 = b2bContent.match(/<h4/gi) || [];

        console.log('H3 in B2B section:', b2bH3.length);
        console.log('H4 in B2B section:', b2bH4.length);

        // Show first 3000 chars
        console.log('\n=== FIRST 3000 CHARS ===');
        console.log(content.substring(0, 3000));
    });
});

req.end();
