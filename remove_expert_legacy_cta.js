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

    // Find the legacy CTA "専門家にご相談ください"
    const marker = '専門家にご相談ください';
    const idx = content.indexOf(marker);

    if (idx > -1) {
        // Find the containing structure - look for h3 or div before the marker
        let startIdx = content.lastIndexOf('<h3', idx);
        if (startIdx === -1) {
            startIdx = content.lastIndexOf('<div', idx);
        }

        // Find end - look for the button link and closing tags
        const buttonMarker = 'お問い合わせはこちら</a>';
        let endIdx = content.indexOf(buttonMarker, idx);
        if (endIdx > -1) {
            // Find the closing </p> after the button
            endIdx = content.indexOf('</p>', endIdx) + 4;

            // Check if there's a closing </div> shortly after
            const nextContent = content.substring(endIdx, endIdx + 20);
            if (nextContent.trim().startsWith('</div>')) {
                endIdx = content.indexOf('</div>', endIdx) + 6;
            }
        }

        if (startIdx > -1 && endIdx > startIdx) {
            console.log('Found CTA from position', startIdx, 'to', endIdx);
            console.log('Content to remove (preview):', content.substring(startIdx, Math.min(startIdx + 200, endIdx)) + '...');

            content = content.substring(0, startIdx) + content.substring(endIdx);
            console.log('Removed legacy CTA');
        } else {
            console.log('Could not determine CTA boundaries');
            return;
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
