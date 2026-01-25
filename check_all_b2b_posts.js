const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// Get recent posts to check for B2B section issues
const options = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts?per_page=50&_fields=id,title,link,content',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const posts = JSON.parse(data);

        console.log(`Checking ${posts.length} posts for B2B section issues...\n`);

        let issueCount = 0;

        posts.forEach(post => {
            const content = post.content.rendered;

            // Check if post has B2B section
            const hasB2B = content.includes('b2b-section') || content.includes('企業の採用担当者様へ');

            if (hasB2B) {
                // Check for potential TOC issues
                const hasH2InB2B = content.match(/<div[^>]*b2b-section[^>]*>[\s\S]*?<h2/i);
                const hasH4InB2B = content.match(/<div[^>]*b2b-section[^>]*>[\s\S]*?<h4/i);
                const hasTocShortcode = content.includes('[toc');

                // Check for comment blocks that cause spacing
                const hasCommentBlock = content.includes('<!-- タイ転職完全ガイド') ||
                                        content.includes('<!-- 作成日:') ||
                                        content.includes('<!-- 目標:');

                console.log(`\n📄 Post ${post.id}: ${post.title.rendered.substring(0, 50)}`);
                console.log(`   URL: ${post.link}`);
                console.log(`   - Has B2B section: ✓`);
                console.log(`   - H2 inside B2B: ${hasH2InB2B ? '⚠️ YES' : 'No'}`);
                console.log(`   - H4 inside B2B: ${hasH4InB2B ? '⚠️ YES' : 'No'}`);
                console.log(`   - Has [toc] shortcode: ${hasTocShortcode ? '✓' : '❌ Missing'}`);
                console.log(`   - Has comment spacing issue: ${hasCommentBlock ? '⚠️ YES' : 'No'}`);

                if (hasH2InB2B || hasH4InB2B || !hasTocShortcode || hasCommentBlock) {
                    issueCount++;
                    console.log(`   ⚠️ POTENTIAL ISSUE`);
                }
            }
        });

        console.log(`\n========================================`);
        console.log(`Total posts with B2B section issues: ${issueCount}`);
    });
});

req.end();
