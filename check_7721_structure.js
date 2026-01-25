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

        // Find the B2B section and show its complete structure
        const b2bStart = content.indexOf('<div class="b2b-section"');
        if (b2bStart >= 0) {
            // Find where it should end - look for the closing pattern
            let depth = 0;
            let pos = b2bStart;
            let b2bEnd = -1;

            while (pos < content.length) {
                if (content.substring(pos, pos + 4) === '<div') {
                    depth++;
                } else if (content.substring(pos, pos + 6) === '</div>') {
                    depth--;
                    if (depth === 0) {
                        b2bEnd = pos + 6;
                        break;
                    }
                }
                pos++;
            }

            console.log('=== B2B SECTION (', b2bEnd - b2bStart, 'chars) ===');
            console.log(content.substring(b2bStart, b2bEnd));

            console.log('\n\n=== AFTER B2B SECTION (next 1000 chars) ===');
            console.log(content.substring(b2bEnd, b2bEnd + 1000));
        }

        // Count divs to check for balance
        const openDivs = (content.match(/<div/g) || []).length;
        const closeDivs = (content.match(/<\/div>/g) || []).length;
        console.log('\n=== DIV BALANCE ===');
        console.log('Open divs:', openDivs);
        console.log('Close divs:', closeDivs);
    });
});

req.end();
