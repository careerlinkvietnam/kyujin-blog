const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');
const postId = process.argv[2] || 8574;

const options = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: `/blog/wp-json/wp/v2/posts/${postId}?context=edit`,
    method: 'GET',
    headers: { 'Authorization': 'Basic ' + auth }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const post = JSON.parse(data);
        const content = post.content.raw || '';

        console.log('ID:', post.id);
        console.log('Title:', post.title.rendered);
        console.log('URL:', post.link);
        console.log('Content length:', content.length);
        console.log('');

        // Check TOC
        console.log('TOC present:', content.includes('[toc') ? 'Yes' : 'No');

        // Check existing CTAs
        const ctaBoxes = (content.match(/cta-box/g) || []).length;
        console.log('CTA boxes:', ctaBoxes);

        // Find CTA classes
        const ctaPattern = /class="[^"]*cta-[^"]*"/g;
        let match;
        while ((match = ctaPattern.exec(content)) !== null) {
            console.log('  Found:', match[0]);
        }

        // Check for legacy CTAs
        console.log('');
        console.log('Legacy patterns:');
        console.log('- 東南アジア進出・人材採用のご相談:', content.includes('東南アジア進出・人材採用のご相談') ? 'FOUND' : 'no');
        console.log('- 専門家にご相談ください:', content.includes('専門家にご相談ください') ? 'FOUND' : 'no');
        console.log('- ベトナムで採用をお考え:', content.includes('ベトナムで採用をお考え') ? 'FOUND' : 'no');
        console.log('- ベトナムで働くことに興味:', content.includes('ベトナムで働くことに興味') ? 'FOUND' : 'no');
        console.log('- タイで働くことに興味:', content.includes('タイで働くことに興味') ? 'FOUND' : 'no');
        console.log('- cta-light:', content.includes('cta-light') ? 'FOUND' : 'no');
        console.log('- cta-standard:', content.includes('cta-standard') ? 'FOUND' : 'no');

        // Check 関連記事
        console.log('');
        const h2Related = content.match(/<h2[^>]*>[^<]*関連記事[^<]*<\/h2>/g) || [];
        console.log('H2 関連記事 sections:', h2Related.length);
        h2Related.forEach((m, i) => console.log('  #' + (i + 1) + ':', m));

        // Check for consecutive 関連記事 at end
        const lastPart = content.substring(content.length - 3000);
        const relatedInEnd = (lastPart.match(/関連記事/g) || []).length;
        console.log('関連記事 in last 3000 chars:', relatedInEnd);

        // Show end of article
        console.log('');
        console.log('=== 記事末尾（最後1500文字） ===');
        console.log(content.substring(content.length - 1500));
    });
});
req.end();
