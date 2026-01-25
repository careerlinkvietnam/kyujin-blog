const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Articles with actual legacy CTAs (not false positives)
const articlesToFix = [
    { id: 7734, city: 'バンコク' },
    { id: 7735, city: 'ホーチミン' },
    { id: 7702, city: 'ベトナム' }
];

// False positives - 専門家 is in normal text content, not a CTA
const falsePositives = [8266, 8265, 8264, 8138];

async function fetchArticle(postId) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: `/blog/wp-json/wp/v2/posts/${postId}?context=edit`,
            method: 'GET',
            headers: { 'Authorization': `Basic ${auth}` }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        });
        req.on('error', () => resolve(null));
        req.end();
    });
}

async function updateArticle(postId, content) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({ content: content });
        const options = {
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

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => resolve({ status: res.statusCode }));
        });
        req.on('error', () => resolve({ status: 500 }));
        req.write(postData);
        req.end();
    });
}

function removeLegacyCTAByPattern(content, city) {
    const searchText = `${city}で働くことに興味はありませんか`;
    if (!content.includes(searchText)) {
        return content;
    }

    // Various background patterns used in legacy CTAs
    const bgPatterns = [
        'background: #e91e63',
        'background:#e91e63',
        'background: linear-gradient(135deg, #1565c0',
        'background:linear-gradient(135deg, #1565c0',
        'background: linear-gradient(135deg,#1565c0',
        'background-color: #f0f8ff',
        'background-color:#f0f8ff',
    ];

    for (const bgPattern of bgPatterns) {
        let pos = 0;
        while (true) {
            // Find div with this background
            const divIdx = content.indexOf('<div', pos);
            if (divIdx === -1) break;

            const divEnd = content.indexOf('>', divIdx);
            if (divEnd === -1) break;

            const divTag = content.substring(divIdx, divEnd + 1);

            if (divTag.includes(bgPattern)) {
                // Check if this div contains the search text
                const searchEnd = Math.min(divIdx + 2000, content.length);
                const checkSection = content.substring(divIdx, searchEnd);

                if (checkSection.includes(searchText)) {
                    // Found it! Now find the matching closing div
                    let divCount = 1;
                    let scanPos = divEnd + 1;

                    while (divCount > 0 && scanPos < content.length) {
                        const nextOpen = content.indexOf('<div', scanPos);
                        const nextClose = content.indexOf('</div>', scanPos);

                        if (nextClose === -1) break;

                        if (nextOpen !== -1 && nextOpen < nextClose) {
                            divCount++;
                            scanPos = nextOpen + 4;
                        } else {
                            divCount--;
                            if (divCount === 0) {
                                const removeEnd = nextClose + 6;
                                console.log(`  Removing legacy CTA (${city}) from ${divIdx} to ${removeEnd}`);

                                // Also remove preceding comment if present
                                let removeStart = divIdx;
                                const before = content.substring(Math.max(0, divIdx - 50), divIdx);
                                const commentMatch = before.match(/<p><!--\s*CTA\s*--><\/p>\s*$/i) ||
                                                     before.match(/<p><!--\s*メインCTA\s*--><\/p>\s*$/i);
                                if (commentMatch) {
                                    removeStart = divIdx - commentMatch[0].length;
                                }

                                content = content.substring(0, removeStart) + content.substring(removeEnd);
                                return content;
                            }
                            scanPos = nextClose + 6;
                        }
                    }
                }
            }
            pos = divEnd + 1;
        }
    }

    return content;
}

async function main() {
    console.log('Fixing', articlesToFix.length, 'articles with legacy CTAs...\n');
    console.log('False positives (will be marked OK in check):', falsePositives.join(', '), '\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < articlesToFix.length; i++) {
        const { id, city } = articlesToFix[i];

        const post = await fetchArticle(id);
        if (!post || !post.content?.raw) {
            console.log(`[${i+1}/${articlesToFix.length}] ID ${id} - Fetch error`);
            errorCount++;
            continue;
        }

        console.log(`[${i+1}/${articlesToFix.length}] ID ${id} - ${post.title?.rendered?.substring(0, 40)}`);

        let content = post.content.raw;
        const originalLen = content.length;

        content = removeLegacyCTAByPattern(content, city);

        if (content.length === originalLen) {
            console.log('  No changes made');
            continue;
        }

        const result = await updateArticle(id, content);

        if (result.status === 200) {
            console.log('  OK - Removed', originalLen - content.length, 'chars');
            successCount++;
        } else {
            console.log('  Error:', result.status);
            errorCount++;
        }

        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\n=== Summary ===');
    console.log('Fixed:', successCount);
    console.log('Errors:', errorCount);
}

main();
