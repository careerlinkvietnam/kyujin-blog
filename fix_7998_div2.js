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

    // Count div tags
    let divOpens = (content.match(/<div/gi) || []).length;
    let divCloses = (content.match(/<\/div>/gi) || []).length;
    console.log('Before - Div opens:', divOpens, 'closes:', divCloses);

    // If more opens than closes, we need to add closing tags
    if (divOpens > divCloses) {
        const missing = divOpens - divCloses;
        console.log('Missing', missing, '</div> tags');

        // Add missing </div> at the end
        for (let i = 0; i < missing; i++) {
            content = content + '</div>';
        }
    }

    // If more closes than opens, we need to remove extra closing tags
    if (divCloses > divOpens) {
        const excess = divCloses - divOpens;
        console.log('Excess', excess, '</div> tags');

        // Scan and find orphaned </div>
        let pos = 0;
        let openCount = 0;
        let toRemove = [];

        while (pos < content.length) {
            const nextOpen = content.indexOf('<div', pos);
            const nextClose = content.indexOf('</div>', pos);

            if (nextOpen === -1 && nextClose === -1) break;

            if (nextOpen !== -1 && (nextClose === -1 || nextOpen < nextClose)) {
                openCount++;
                pos = nextOpen + 4;
            } else if (nextClose !== -1) {
                openCount--;
                if (openCount < 0) {
                    toRemove.push(nextClose);
                    openCount = 0;
                }
                pos = nextClose + 6;
            }
        }

        // Remove from end to start
        for (let i = toRemove.length - 1; i >= 0; i--) {
            content = content.substring(0, toRemove[i]) + content.substring(toRemove[i] + 6);
        }
    }

    // Verify
    divOpens = (content.match(/<div/gi) || []).length;
    divCloses = (content.match(/<\/div>/gi) || []).length;
    console.log('After - Div opens:', divOpens, 'closes:', divCloses);

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
        console.log('URL: https://kyujin.careerlink.asia/blog/vietnam-labor-law-employer-guide-2026/');
    } else {
        console.log('Error:', result.status);
    }
}

main();
