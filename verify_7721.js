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

        console.log('Title:', json.title.rendered);
        console.log('Link:', json.link);
        console.log('Content length:', content.length, 'chars');

        // Find all CTAs with positions
        console.log('\n=== CTA POSITIONS ===');
        let idx = 0;
        let ctaNum = 0;
        while (true) {
            const pos = content.indexOf('cta-jobseeker-thailand', idx);
            if (pos === -1) break;
            ctaNum++;
            const percent = ((pos / content.length) * 100).toFixed(1);

            // Find surrounding h2 for context
            const beforeContent = content.substring(Math.max(0, pos - 500), pos);
            const afterContent = content.substring(pos, Math.min(content.length, pos + 500));

            const beforeH2 = beforeContent.match(/<h2[^>]*>([^<]*)<\/h2>/gi);
            const afterH2 = afterContent.match(/<h2[^>]*>([^<]*)<\/h2>/gi);

            console.log(`\nCTA ${ctaNum}: Position ${pos} (${percent}%)`);
            if (beforeH2) console.log('  Before section:', beforeH2[beforeH2.length - 1].replace(/<[^>]*>/g, '').substring(0, 40));
            if (afterH2) console.log('  After section:', afterH2[0].replace(/<[^>]*>/g, '').substring(0, 40));

            idx = pos + 1;
        }

        console.log('\n=== SUMMARY ===');
        console.log('Total CTAs:', ctaNum);
        console.log('Article URL:', json.link);
    });
});

req.end();
