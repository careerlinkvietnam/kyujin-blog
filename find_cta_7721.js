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
        const content = json.content.raw;

        // Find the CTA with "キャリアリンクアジアでタイ転職を実現"
        const searchText = 'キャリアリンクアジアでタイ転職を実現';
        const pos = content.indexOf(searchText);

        if (pos >= 0) {
            // Find the surrounding div
            let start = content.lastIndexOf('<div', pos);
            let end = pos;
            let depth = 1;

            // Find the closing div
            let i = content.indexOf('>', pos) + 1;
            while (i < content.length && depth > 0) {
                if (content.substring(i, i + 4) === '<div') {
                    depth++;
                } else if (content.substring(i, i + 6) === '</div>') {
                    depth--;
                    if (depth === 0) {
                        end = i + 6;
                        break;
                    }
                }
                i++;
            }

            console.log('=== CTA HTML STRUCTURE ===');
            console.log(content.substring(start, end));
        } else {
            console.log('CTA not found');

            // Search for alternative
            const altSearch = 'タイ転職を実現';
            const altPos = content.indexOf(altSearch);
            if (altPos >= 0) {
                console.log('\nFound at position:', altPos);
                console.log(content.substring(Math.max(0, altPos - 200), altPos + 500));
            }
        }
    });
});

req.end();
