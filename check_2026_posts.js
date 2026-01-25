const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Get posts from 2026
const options = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts?per_page=100&after=2025-12-31T23:59:59&_fields=id,title,link,content,date',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const posts = JSON.parse(data);

        console.log(`Found ${posts.length} posts from 2026\n`);
        console.log('========================================\n');

        let issuesFound = [];

        posts.forEach(post => {
            const content = post.content.rendered;
            const date = post.date.substring(0, 10);
            let issues = [];

            // Check 1: B2B section with headings inside
            const hasB2BSection = content.includes('b2b-section') ||
                                  content.includes('企業の採用担当者様へ');
            if (hasB2BSection) {
                const b2bMatch = content.match(/<div[^>]*(?:b2b-section|企業の採用担当者様へ)[\s\S]*?<\/div>/i);
                if (b2bMatch) {
                    const b2bContent = b2bMatch[0];
                    if (/<h[234][^>]*>/i.test(b2bContent)) {
                        issues.push('B2B section contains H2/H3/H4 (TOC conflict)');
                    }
                }
            }

            // Check 2: H4 inside styled div at the very beginning (before first H2)
            const firstH2Pos = content.indexOf('<h2');
            if (firstH2Pos > 0) {
                const beforeH2 = content.substring(0, firstH2Pos);
                if (/<div[^>]*style[^>]*>[\s\S]*?<h4/i.test(beforeH2)) {
                    issues.push('H4 inside styled div before first H2');
                }
            }

            // Check 3: No [toc] shortcode (auto-insert may cause issues)
            if (!content.includes('[toc')) {
                // Only flag if there are potential TOC conflicts
                if (issues.length > 0) {
                    issues.push('No [toc] shortcode (using auto-insert)');
                }
            }

            // Check 4: Comment blocks with <br> causing spacing
            if (/<p><!--[^>]*--><br/i.test(content)) {
                issues.push('Comment block with <br> (spacing issue)');
            }

            // Check 5: Empty paragraph at start
            if (content.startsWith('<p>﻿</p>') || content.match(/^<p>\s*<\/p>/)) {
                issues.push('Empty paragraph at start');
            }

            // Check 6: Multiple empty paragraphs
            if (/<p>﻿<\/p>\s*<p>﻿<\/p>/i.test(content)) {
                issues.push('Multiple empty paragraphs');
            }

            console.log(`📄 [${date}] Post ${post.id}: ${post.title.rendered.substring(0, 45)}`);
            console.log(`   ${post.link}`);

            if (issues.length > 0) {
                issues.forEach(issue => console.log(`   ⚠️ ${issue}`));
                issuesFound.push({
                    id: post.id,
                    title: post.title.rendered,
                    link: post.link,
                    issues: issues
                });
            } else {
                console.log(`   ✓ No issues found`);
            }
            console.log('');
        });

        console.log('========================================');
        console.log(`\nSUMMARY: ${issuesFound.length} posts with issues\n`);

        if (issuesFound.length > 0) {
            console.log('Posts needing fixes:');
            issuesFound.forEach(post => {
                console.log(`- Post ${post.id}: ${post.title.substring(0, 40)}`);
                post.issues.forEach(issue => console.log(`    → ${issue}`));
            });
        }
    });
});

req.end();
