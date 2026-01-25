const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const options = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts?per_page=100&_fields=id,title,link,content',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const posts = JSON.parse(data);

        console.log(`Checking ${posts.length} posts for layout issues...\n`);

        let issues = [];

        posts.forEach(post => {
            const content = post.content.rendered;
            let postIssues = [];

            // Check 1: H2/H3/H4 inside styled div at the beginning (before first real H2)
            const firstH2 = content.indexOf('<h2');
            if (firstH2 > 0) {
                const beforeFirstH2 = content.substring(0, firstH2);
                const hasStyledDivWithHeadings = beforeFirstH2.match(/<div[^>]*style[^>]*>[\s\S]*?<h[234]/i);
                if (hasStyledDivWithHeadings) {
                    postIssues.push('H2/H3/H4 inside styled div before content');
                }
            }

            // Check 2: Comment blocks causing spacing
            const commentPatterns = [
                /<!-- 作成日:/,
                /<!-- 目標:/,
                /<!-- 改善版/,
                /<p><!--[^>]*--><br\s*\/?>/
            ];
            commentPatterns.forEach(pattern => {
                if (pattern.test(content)) {
                    postIssues.push('Comment block with <br> (spacing issue)');
                }
            });

            // Check 3: Empty divs that might cause spacing
            if (/<div>\s*<\/div>/.test(content)) {
                postIssues.push('Empty <div></div> tags');
            }

            // Check 4: Multiple consecutive <br> or empty <p> tags
            if (/<br\s*\/?>\s*<br\s*\/?>\s*<br\s*\/?>/.test(content)) {
                postIssues.push('Multiple consecutive <br> tags');
            }

            if (postIssues.length > 0) {
                issues.push({
                    id: post.id,
                    title: post.title.rendered.substring(0, 50),
                    link: post.link,
                    issues: [...new Set(postIssues)]
                });
            }
        });

        console.log('========================================');
        console.log(`Found ${issues.length} posts with potential issues:\n`);

        issues.forEach(post => {
            console.log(`📄 Post ${post.id}: ${post.title}`);
            console.log(`   ${post.link}`);
            post.issues.forEach(issue => {
                console.log(`   ⚠️ ${issue}`);
            });
            console.log('');
        });
    });
});

req.end();
