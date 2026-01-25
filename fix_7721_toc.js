const https = require('https');
const fs = require('fs');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

// First, get current content
const getOptions = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts/7721',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(getOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        let content = json.content.rendered;

        console.log('Original content length:', content.length);

        // Fix 1: Change H2 inside B2B section to div (so it won't appear in TOC)
        // The B2B section H2: <h2 style="color: #fff; margin-top: 0; border: none;">🏢 企業の採用担当者様へ</h2>
        const oldB2BHeading = '<h2 style="color: #fff; margin-top: 0; border: none;">🏢 企業の採用担当者様へ</h2>';
        const newB2BHeading = '<div style="color: #fff; margin-top: 0; border: none; font-size: 1.5em; font-weight: bold; margin-bottom: 16px;">🏢 企業の採用担当者様へ</div>';

        if (content.includes(oldB2BHeading)) {
            content = content.replace(oldB2BHeading, newB2BHeading);
            console.log('Fixed: B2B section heading changed from H2 to div');
        } else {
            console.log('Warning: B2B section H2 not found exactly, trying regex...');
            // Try regex match
            const h2Regex = /<h2[^>]*>🏢 企業の採用担当者様へ<\/h2>/gi;
            if (h2Regex.test(content)) {
                content = content.replace(h2Regex, newB2BHeading);
                console.log('Fixed: B2B section heading changed from H2 to div (via regex)');
            }
        }

        // Fix 2: Also change the "タイへの転職をお考えの方へ" H2 to div since it's introductory, not a content section
        const oldJobseekerHeading = '<h2>🎯 タイへの転職をお考えの方へ</h2>';
        const newJobseekerHeading = '<div style="font-size: 1.5em; font-weight: bold; margin: 20px 0 16px 0; color: #333;">🎯 タイへの転職をお考えの方へ</div>';

        if (content.includes(oldJobseekerHeading)) {
            content = content.replace(oldJobseekerHeading, newJobseekerHeading);
            console.log('Fixed: Jobseeker intro heading changed from H2 to div');
        }

        console.log('New content length:', content.length);

        // Update via API
        const postData = JSON.stringify({ content: content });

        const postOptions = {
            hostname: 'kyujin.careerlink.asia',
            port: 443,
            path: '/blog/wp-json/wp/v2/posts/7721',
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        console.log('\nUpdating post 7721...');

        const updateReq = https.request(postOptions, (updateRes) => {
            let updateData = '';
            updateRes.on('data', (chunk) => { updateData += chunk; });
            updateRes.on('end', () => {
                if (updateRes.statusCode === 200) {
                    console.log('SUCCESS! Post 7721 updated.');

                    // Verify the changes
                    const result = JSON.parse(updateData);
                    const newContent = result.content.rendered;

                    // Check if H2s are still in B2B/intro sections
                    const b2bH2Check = newContent.includes('企業の採用担当者様へ</h2>');
                    const introH2Check = newContent.includes('タイへの転職をお考えの方へ</h2>');

                    console.log('\nVerification:');
                    console.log('- B2B section still has H2:', b2bH2Check);
                    console.log('- Intro section still has H2:', introH2Check);

                    // Show first 1500 chars
                    console.log('\n=== FIRST 1500 CHARS (AFTER UPDATE) ===');
                    console.log(newContent.substring(0, 1500));
                } else {
                    console.log('Error:', updateRes.statusCode);
                    console.log(updateData.substring(0, 500));
                }
            });
        });

        updateReq.on('error', (e) => console.error('Request error:', e));
        updateReq.write(postData);
        updateReq.end();
    });
});

req.end();
