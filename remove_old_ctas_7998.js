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

    // Function to remove CTA by class name
    function removeCTAByClass(content, className) {
        const idx = content.indexOf(className);
        if (idx === -1) return content;

        const divStart = content.lastIndexOf('<div', idx);
        // Find closing div - handle nested
        let depth = 1;
        let pos = content.indexOf('>', idx) + 1;
        let divEnd = pos;
        while (depth > 0 && pos < content.length) {
            const nextOpen = content.indexOf('<div', pos);
            const nextClose = content.indexOf('</div>', pos);
            if (nextClose === -1) break;
            if (nextOpen !== -1 && nextOpen < nextClose) {
                depth++;
                pos = nextOpen + 4;
            } else {
                depth--;
                if (depth === 0) divEnd = nextClose + 6;
                pos = nextClose + 6;
            }
        }

        if (divStart > -1 && divEnd > divStart) {
            console.log('Removed', className);
            return content.substring(0, divStart) + content.substring(divEnd);
        }
        return content;
    }

    // Remove cta-light
    content = removeCTAByClass(content, 'cta-box cta-light');

    // Remove cta-standard
    content = removeCTAByClass(content, 'cta-box cta-standard');

    console.log('New length:', content.length);

    // Count remaining CTAs
    const ctaPattern = /<div[^>]*class="[^"]*cta-box[^"]*"/g;
    let match;
    let count = 0;
    while ((match = ctaPattern.exec(content)) !== null) {
        count++;
    }
    console.log('Remaining CTAs:', count);

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
