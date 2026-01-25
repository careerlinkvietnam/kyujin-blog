const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const options = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts/8008?context=edit',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        const content = json.content.raw;

        console.log('Post 8008:', json.title.rendered);
        console.log('Content length:', content.length);
        console.log('URL:', json.link);

        // Check for [toc] shortcode
        const hasToc = content.includes('[toc');
        console.log('\nHas [toc] shortcode:', hasToc);

        if (hasToc) {
            const tocPos = content.indexOf('[toc');
            console.log('[toc] position:', tocPos);
            console.log('Context:', content.substring(Math.max(0, tocPos - 50), tocPos + 100));
        }

        // Check for styled div with headings at the beginning
        console.log('\n=== FIRST 2000 CHARS ===');
        console.log(content.substring(0, 2000));

        // Check for B2B-like sections
        const hasB2BSection = content.includes('b2b-section') ||
                             content.includes('企業の採用担当者様へ') ||
                             content.includes('求職者の方へ');
        console.log('\nHas B2B-like section:', hasB2BSection);

        // Count H2, H3, H4 tags
        const h2Count = (content.match(/<h2/gi) || []).length;
        const h3Count = (content.match(/<h3/gi) || []).length;
        const h4Count = (content.match(/<h4/gi) || []).length;
        console.log(`\nHeading counts: H2=${h2Count}, H3=${h3Count}, H4=${h4Count}`);
    });
});

req.end();
