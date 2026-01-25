const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Articles with issues
const articlesToFix = [
    7726, 8534, 8535, 8245, 8244, 8243, 8241, 8239, 8238, 8236,
    8117, 8115, 8113, 8034, 8008, 8005, 7997, 7734, 7721, 7710,
    7676, 8536, 8270, 8269, 8268, 8267, 8266, 8265, 8264, 8263,
    8262, 8261, 8141, 8140, 8139, 8138, 8118, 8116, 8114, 8035,
    7995, 7735, 7715, 7702, 8526, 8525, 7940, 7939, 7938, 7935,
    7739, 7738, 7720, 7718, 7712, 7711, 7705, 7698, 7691, 7689,
    7686, 7675, 8326
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

function fixContent(content) {
    let fixed = content;
    let changes = [];

    // 1. Fix HTML-encoded 関連記事
    if (fixed.includes('&#x95A2;&#x9023;&#x8A18;&#x4E8B;')) {
        fixed = fixed.replace(/<h2>&#x95A2;&#x9023;&#x8A18;&#x4E8B;<\/h2>/g, '<h2>関連記事</h2>');
        changes.push('HTML-encoded関連記事を修正');
    }

    // 2. Remove H3 関連記事 section (including the following ul)
    const h3Pattern = /<h3>関連記事<\/h3>\s*<ul>[\s\S]*?<\/ul>/gi;
    if (h3Pattern.test(fixed)) {
        fixed = fixed.replace(h3Pattern, '');
        changes.push('H3関連記事セクションを削除');
    }

    // 3. Remove legacy CTAs - more precise patterns
    const legacyPatterns = [
        // "○○で働くことに興味はありませんか" patterns in styled divs
        /<div[^>]*style="[^"]*background-color:\s*#f0f8ff[^"]*"[^>]*>[\s\S]*?(ハノイ|ホーチミン|ベトナム|タイ|バンコク)で働くことに興味はありませんか[\s\S]*?<\/div>\s*<\/div>/gi,
        // "専門家にご相談ください" pattern
        /<div[^>]*class="[^"]*cta[^"]*"[^>]*>[\s\S]*?専門家にご相談ください[\s\S]*?<\/div>/gi,
    ];

    for (const pattern of legacyPatterns) {
        if (pattern.test(fixed)) {
            fixed = fixed.replace(pattern, '');
            changes.push('レガシーCTAを削除');
        }
    }

    // 4. More targeted legacy CTA removal - find and remove specific div blocks
    // Pattern for "○○で働くことに興味はありませんか"
    const workInterestCities = ['ハノイ', 'ホーチミン', 'ベトナム', 'タイ', 'バンコク'];
    for (const city of workInterestCities) {
        const searchText = `${city}で働くことに興味はありませんか`;
        if (fixed.includes(searchText)) {
            // Find the containing div with specific styling
            const startMarkers = [
                '<div style="background-color: #f0f8ff; border: 2px solid #1e90ff;',
                '<div style="background-color:#f0f8ff;border:2px solid #1e90ff',
                '<div style="background: #f0f8ff;',
            ];

            for (const marker of startMarkers) {
                let searchStart = 0;
                while (true) {
                    const divStart = fixed.indexOf(marker, searchStart);
                    if (divStart === -1) break;

                    // Check if this div contains the target text
                    const nextDivEnd = fixed.indexOf('</div>', divStart);
                    const checkContent = fixed.substring(divStart, nextDivEnd + 6);

                    if (checkContent.includes(searchText)) {
                        // Count nested divs to find correct closing
                        let divCount = 1;
                        let pos = fixed.indexOf('>', divStart) + 1;
                        while (divCount > 0 && pos < fixed.length) {
                            const nextOpen = fixed.indexOf('<div', pos);
                            const nextClose = fixed.indexOf('</div>', pos);

                            if (nextClose === -1) break;

                            if (nextOpen > -1 && nextOpen < nextClose) {
                                divCount++;
                                pos = nextOpen + 4;
                            } else {
                                divCount--;
                                if (divCount === 0) {
                                    const divEnd = nextClose + 6;
                                    fixed = fixed.substring(0, divStart) + fixed.substring(divEnd);
                                    changes.push(`レガシーCTA(${city})を削除`);
                                    break;
                                }
                                pos = nextClose + 6;
                            }
                        }
                        break;
                    }
                    searchStart = divStart + 1;
                }
            }
        }
    }

    // 5. Remove "専門家にご相談ください" CTA blocks
    if (fixed.includes('専門家にご相談ください')) {
        const marker = '専門家にご相談ください';
        const markerPos = fixed.indexOf(marker);
        if (markerPos > -1) {
            // Look backwards to find the div start
            let searchPos = markerPos;
            let divStart = -1;
            while (searchPos > 0) {
                const checkPos = fixed.lastIndexOf('<div', searchPos);
                if (checkPos === -1) break;
                // Check if this is a cta-box or styled div
                const divTag = fixed.substring(checkPos, fixed.indexOf('>', checkPos) + 1);
                if (divTag.includes('cta-box') || divTag.includes('background')) {
                    divStart = checkPos;
                    break;
                }
                searchPos = checkPos - 1;
            }

            if (divStart > -1) {
                // Count nested divs
                let divCount = 1;
                let pos = fixed.indexOf('>', divStart) + 1;
                while (divCount > 0 && pos < fixed.length) {
                    const nextOpen = fixed.indexOf('<div', pos);
                    const nextClose = fixed.indexOf('</div>', pos);

                    if (nextClose === -1) break;

                    if (nextOpen > -1 && nextOpen < nextClose) {
                        divCount++;
                        pos = nextOpen + 4;
                    } else {
                        divCount--;
                        if (divCount === 0) {
                            const divEnd = nextClose + 6;
                            fixed = fixed.substring(0, divStart) + fixed.substring(divEnd);
                            changes.push('レガシーCTA(専門家)を削除');
                            break;
                        }
                        pos = nextClose + 6;
                    }
                }
            }
        }
    }

    // 6. Fix old register URL
    if (fixed.includes('/jobseeker/register')) {
        fixed = fixed.replace(/\/jobseeker\/register/g, '/register');
        changes.push('古いURLを修正');
    }

    // 7. Clean up multiple consecutive newlines
    fixed = fixed.replace(/\n{4,}/g, '\n\n\n');

    return { content: fixed, changes };
}

async function main() {
    console.log('Fixing', articlesToFix.length, 'articles...\n');

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

        const originalContent = post.content.raw;
        const { content: fixedContent, changes } = fixContent(originalContent);

        if (changes.length === 0) {
            console.log(`[${i+1}/${articlesToFix.length}] ID ${postId} - No changes needed`);
            continue;
        }

        // Update
        const result = await updateArticle(postId, fixedContent);

        if (result.status === 200) {
            console.log(`[${i+1}/${articlesToFix.length}] ID ${postId} - OK: ${changes.join(', ')}`);
            successCount++;
        } else {
            console.log(`[${i+1}/${articlesToFix.length}] ID ${postId} - Error: ${result.status}`);
            errorCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 300));
    }

    console.log('\n=== Summary ===');
    console.log('Total:', articlesToFix.length);
    console.log('Fixed:', successCount);
    console.log('Errors:', errorCount);
    console.log('No changes:', articlesToFix.length - successCount - errorCount);
}

main();
