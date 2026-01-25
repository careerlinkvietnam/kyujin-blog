const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

async function main() {
    // Fetch
    const getOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/8009?context=edit',
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

    // Find all instances of "専門家にご相談ください"
    let removed = 0;
    while (content.includes('専門家にご相談ください')) {
        const idx = content.indexOf('専門家にご相談ください');

        // Find the containing div (look for the specific style)
        const divStart = content.lastIndexOf('<div style="background: #e3f2fd', idx);
        if (divStart === -1 || idx - divStart > 500) {
            // Try alternative pattern
            const altDivStart = content.lastIndexOf('<div', idx);
            if (altDivStart > -1 && idx - altDivStart < 200) {
                const divEnd = content.indexOf('</div>', idx) + 6;
                content = content.substring(0, altDivStart) + content.substring(divEnd);
                removed++;
                console.log('Removed legacy CTA (alt method)');
                continue;
            }
            break;
        }

        const divEnd = content.indexOf('</div>', idx) + 6;
        if (divEnd > divStart) {
            console.log('Removing from', divStart, 'to', divEnd);
            content = content.substring(0, divStart) + content.substring(divEnd);
            removed++;
            console.log('Removed legacy CTA');
        } else {
            break;
        }
    }

    console.log('Total removed:', removed);
    console.log('New length:', content.length);

    // Verify
    console.log('Remaining "専門家にご相談ください":', content.includes('専門家にご相談ください') ? 'FOUND' : 'none');

    // Update
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: '/blog/wp-json/wp/v2/posts/8009',
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
