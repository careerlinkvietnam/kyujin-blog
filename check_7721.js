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
        console.log('Title:', json.title.rendered);
        console.log('Link:', json.link);
        console.log('Content length:', json.content.rendered.length, 'chars');

        const content = json.content.rendered;

        // Check for existing CTAs
        const ctaMatches = content.match(/(cta-box|cta-jobseeker|cta-hr|cta-lp|東南アジア進出|専門家にご相談|お問い合わせはこちら)/gi);
        console.log('\nCTA patterns found:', ctaMatches ? ctaMatches.length : 0);
        if (ctaMatches) {
            console.log('Patterns:', [...new Set(ctaMatches)]);
        }

        // Show end of content to see current CTA placement
        console.log('\n=== LAST 2000 CHARS ===');
        console.log(content.substring(content.length - 2000));
    });
});

req.end();
