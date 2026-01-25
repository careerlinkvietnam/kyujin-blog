const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Remaining 20 articles with issues
const articlesToFix = [
    8117, 8115, 8113, 7734, 7721, 7710,
    8266, 8265, 8264, 8139, 8138, 8118,
    8116, 8114, 7735, 7702, 7940, 7939,
    7938, 7935
];

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

function removeDuplicateH2Related(content) {
    // Find all H2 関連記事 sections
    const h2Pattern = /<h2[^>]*>関連記事<\/h2>/gi;
    const matches = [];
    let match;

    while ((match = h2Pattern.exec(content)) !== null) {
        matches.push(match.index);
    }

    if (matches.length <= 1) {
        return { content, removed: false };
    }

    console.log(`    Found ${matches.length} H2 関連記事 sections at positions:`, matches);

    // Keep only the last one (usually the proper one at the end)
    // Remove all but the last one
    let newContent = content;

    for (let i = matches.length - 2; i >= 0; i--) {
        const startPos = matches[i];
        // Find the next H2 or the kept H2 section
        let endPos = i < matches.length - 2 ? matches[i + 1] : content.indexOf('<h2', startPos + 10);

        if (endPos === -1 || endPos < startPos) {
            // Just remove this H2 and its ul if present
            const h2End = newContent.indexOf('</h2>', startPos) + 5;
            const ulStart = newContent.indexOf('<ul>', h2End);
            const ulEnd = newContent.indexOf('</ul>', ulStart);

            if (ulStart > h2End && ulStart - h2End < 50 && ulEnd > ulStart) {
                // Remove H2 and its ul
                newContent = newContent.substring(0, startPos) + newContent.substring(ulEnd + 5);
            } else {
                // Just remove the H2
                newContent = newContent.substring(0, startPos) + newContent.substring(h2End);
            }
        } else {
            // Remove from this H2 to the next H2
            newContent = newContent.substring(0, startPos) + newContent.substring(endPos);
        }
    }

    return { content: newContent, removed: true };
}

function removeLegacyCTA(content, city) {
    const searchText = `${city}で働くことに興味はありませんか`;
    if (!content.includes(searchText)) {
        return content;
    }

    // Find the containing styled div
    const startMarkers = [
        '<div style="background-color: #f0f8ff;',
        '<div style="background:#f0f8ff;',
        '<div style="background-color:#f0f8ff;',
    ];

    for (const marker of startMarkers) {
        let pos = 0;
        while (true) {
            const divStart = content.indexOf(marker, pos);
            if (divStart === -1) break;

            // Check if this div contains the target text
            const searchEnd = Math.min(divStart + 2000, content.length);
            const searchSection = content.substring(divStart, searchEnd);

            if (searchSection.includes(searchText)) {
                // Count nested divs to find correct closing
                let divCount = 1;
                let scanPos = content.indexOf('>', divStart) + 1;
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
                            const divEnd = nextClose + 6;
                            console.log(`    Removing legacy CTA (${city}) from ${divStart} to ${divEnd}`);
                            content = content.substring(0, divStart) + content.substring(divEnd);
                            return content;
                        }
                        scanPos = nextClose + 6;
                    }
                }
            }
            pos = divStart + 1;
        }
    }

    return content;
}

function removeExpertCTA(content) {
    const marker = '専門家にご相談ください';
    if (!content.includes(marker)) {
        return content;
    }

    // Find this text and work backwards to find the containing cta-box div
    const markerPos = content.indexOf(marker);
    if (markerPos === -1) return content;

    // Look for cta-box or styled div before the marker
    let divStart = -1;
    let searchPos = markerPos;

    while (searchPos > 0) {
        const checkPos = content.lastIndexOf('<div', searchPos);
        if (checkPos === -1) break;

        const divTag = content.substring(checkPos, content.indexOf('>', checkPos) + 1);
        if (divTag.includes('cta-box') || divTag.includes('background')) {
            divStart = checkPos;
            break;
        }
        searchPos = checkPos - 1;
    }

    if (divStart === -1) return content;

    // Count nested divs to find correct closing
    let divCount = 1;
    let scanPos = content.indexOf('>', divStart) + 1;
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
                const divEnd = nextClose + 6;
                console.log(`    Removing expert CTA from ${divStart} to ${divEnd}`);
                content = content.substring(0, divStart) + content.substring(divEnd);
                return content;
            }
            scanPos = nextClose + 6;
        }
    }

    return content;
}

async function main() {
    console.log('Fixing', articlesToFix.length, 'remaining articles...\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < articlesToFix.length; i++) {
        const postId = articlesToFix[i];

        // Fetch article
        const post = await fetchArticle(postId);
        if (!post || !post.content?.raw) {
            console.log(`[${i+1}/${articlesToFix.length}] ID ${postId} - Fetch error`);
            errorCount++;
            continue;
        }

        console.log(`[${i+1}/${articlesToFix.length}] ID ${postId} - ${post.title?.rendered?.substring(0, 40)}`);

        let content = post.content.raw;
        let changes = [];

        // 1. Remove duplicate H2 関連記事
        const h2Result = removeDuplicateH2Related(content);
        if (h2Result.removed) {
            content = h2Result.content;
            changes.push('重複H2関連記事を削除');
        }

        // 2. Remove legacy CTAs
        const cities = ['ハノイ', 'ホーチミン', 'ベトナム', 'タイ', 'バンコク'];
        for (const city of cities) {
            const beforeLen = content.length;
            content = removeLegacyCTA(content, city);
            if (content.length < beforeLen) {
                changes.push(`レガシーCTA(${city})を削除`);
            }
        }

        // 3. Remove expert CTA
        const beforeExpert = content.length;
        content = removeExpertCTA(content);
        if (content.length < beforeExpert) {
            changes.push('専門家CTAを削除');
        }

        if (changes.length === 0) {
            console.log('    No changes needed');
            continue;
        }

        // Update
        const result = await updateArticle(postId, content);

        if (result.status === 200) {
            console.log('    OK:', changes.join(', '));
            successCount++;
        } else {
            console.log('    Error:', result.status);
            errorCount++;
        }

        // Small delay
        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\n=== Summary ===');
    console.log('Total:', articlesToFix.length);
    console.log('Fixed:', successCount);
    console.log('Errors:', errorCount);
}

main();
