const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

async function main() {
    // Fetch
    const getOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7998?context=edit',
        method: 'GET',
        headers: { 'Authorization': `Basic ${auth}` }
    };

    const post = await new Promise((resolve) => {
        const req = https.request(getOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.end();
    });

    let content = post.content.raw;
    console.log('Original length:', content.length);

    // Find the legacy CTA
    const marker = 'ベトナムで採用をお考えの人事担当者様へ';
    const idx = content.indexOf(marker);

    if (idx > -1) {
        // Find the containing div
        const divStart = content.lastIndexOf('<div', idx);
        // Find the closing </div> - need to handle nested divs
        let depth = 1;
        let pos = content.indexOf('>', divStart) + 1;
        while (depth > 0 && pos < content.length) {
            const nextOpen = content.indexOf('<div', pos);
            const nextClose = content.indexOf('</div>', pos);

            if (nextClose === -1) break;

            if (nextOpen !== -1 && nextOpen < nextClose) {
                depth++;
                pos = nextOpen + 4;
            } else {
                depth--;
                if (depth === 0) {
                    const divEnd = nextClose + 6;
                    console.log('Removing from', divStart, 'to', divEnd);
                    content = content.substring(0, divStart) + content.substring(divEnd);
                    console.log('Removed legacy CTA');
                }
                pos = nextClose + 6;
            }
        }
    } else {
        console.log('Legacy CTA not found');
        return;
    }

    console.log('New length:', content.length);

    // Update
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/7998',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const result = await new Promise((resolve) => {
        const req = https.request(postOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve({ status: res.statusCode }));
        });
        req.write(postData);
        req.end();
    });

    if (result.status === 200) {
        console.log('Updated successfully');
    } else {
        console.log('Error:', result.status);
    }
}

main();
