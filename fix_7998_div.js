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

    // Find standalone </div> that might be orphaned
    // Look for patterns like </div> at end of content or double </div>

    // Check for orphan </div> at the end
    if (content.trim().endsWith('</div>')) {
        // Check if there's a proper opening
        const lastDivClose = content.lastIndexOf('</div>');
        const lastDivOpen = content.lastIndexOf('<div', lastDivClose);

        // Check if this last closing has a proper match
        let checkPos = lastDivOpen;
        let count = 0;
        while (checkPos < content.length) {
            const nextOpen = content.indexOf('<div', checkPos + 1);
            const nextClose = content.indexOf('</div>', checkPos + 1);

            if (nextClose === -1) break;

            if (nextOpen !== -1 && nextOpen < nextClose) {
                count++;
                checkPos = nextOpen;
            } else {
                count--;
                if (count < 0) {
                    // This </div> is orphaned
                    console.log('Found orphaned </div> near position:', nextClose);
                    content = content.substring(0, nextClose) + content.substring(nextClose + 6);
                    break;
                }
                checkPos = nextClose;
            }
        }
    }

    // Alternative: Look for </div></div> patterns at the end of CTA boxes
    // and check if they have correct matching

    // Actually, let's just scan for any place where we have more closes than opens
    let pos = 0;
    let openCount = 0;
    let issues = [];

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
                issues.push(nextClose);
                openCount = 0;
            }
            pos = nextClose + 6;
        }
    }

    console.log('Found', issues.length, 'orphaned </div> at positions:', issues);

    // Remove orphaned </div>s from end to start
    for (let i = issues.length - 1; i >= 0; i--) {
        const removePos = issues[i];
        content = content.substring(0, removePos) + content.substring(removePos + 6);
        console.log('Removed orphaned </div> at position', removePos);
    }

    // Verify
    divOpens = (content.match(/<div/gi) || []).length;
    divCloses = (content.match(/<\/div>/gi) || []).length;
    console.log('After - Div opens:', divOpens, 'closes:', divCloses);

    if (divOpens !== divCloses) {
        console.log('Still mismatched! Difference:', divCloses - divOpens);

        // If we still have more closes than opens, find and remove them
        if (divCloses > divOpens) {
            const excess = divCloses - divOpens;
            console.log('Need to remove', excess, 'extra </div>');

            // Find all </div> positions
            const closePositions = [];
            let searchPos = 0;
            while (true) {
                const found = content.indexOf('</div>', searchPos);
                if (found === -1) break;
                closePositions.push(found);
                searchPos = found + 6;
            }

            // Remove the last N closes
            for (let i = 0; i < excess; i++) {
                const removeIdx = closePositions.length - 1 - i;
                if (removeIdx >= 0) {
                    const removePos = closePositions[removeIdx];
                    content = content.substring(0, removePos) + content.substring(removePos + 6);
                    console.log('Removed extra </div> at approximate position', removePos);
                }
            }
        }
    }

    // Final verification
    divOpens = (content.match(/<div/gi) || []).length;
    divCloses = (content.match(/<\/div>/gi) || []).length;
    console.log('Final - Div opens:', divOpens, 'closes:', divCloses);

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
