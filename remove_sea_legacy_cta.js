const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

async function removeFromPost(postId) {
    // Fetch
    const getOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: `/blog/wp-json/wp/v2/posts/${postId}?context=edit`,
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
    console.log(`Post ${postId}: Original length:`, content.length);

    // Find and remove the legacy CTA
    const startMarker = '<div style="background: #e8f4fd; padding: 25px; margin-top: 40px; border-radius: 8px;">\n<h3 style="margin-top: 0;">東南アジア進出・人材採用のご相談</h3>';
    const endMarker = 'お問い合わせはこちら</a></p>\n</div>';

    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) {
        // Try alternative pattern
        const altStart = content.indexOf('東南アジア進出・人材採用のご相談');
        if (altStart > -1) {
            // Find the containing div
            const divStart = content.lastIndexOf('<div', altStart);
            const divEnd = content.indexOf('</div>', altStart) + 6;
            if (divStart > -1 && divEnd > divStart) {
                content = content.substring(0, divStart) + content.substring(divEnd);
                console.log(`Removed legacy CTA (alt method)`);
            }
        } else {
            console.log('Legacy CTA not found');
            return;
        }
    } else {
        const endIdx = content.indexOf(endMarker, startIdx);
        if (endIdx > -1) {
            content = content.substring(0, startIdx) + content.substring(endIdx + endMarker.length);
            console.log('Removed legacy CTA');
        }
    }

    console.log('New length:', content.length);

    // Update
    const postData = JSON.stringify({ content: content });
    const postOptions = {
        hostname: 'kyujin.careerlink.asia',
        port: 443,
        path: `/blog/wp-json/wp/v2/posts/${postId}`,
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
        console.log('Updated successfully\n');
    } else {
        console.log('Error:', result.status, '\n');
    }
}

async function main() {
    await removeFromPost(7998);
}

main();
