const https = require('https');

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const getOptions = {
    hostname: 'kyujin.careerlink.asia',
    port: 443,
    path: '/blog/wp-json/wp/v2/posts/7721?context=edit',
    method: 'GET',
    headers: { 'Authorization': `Basic ${auth}` }
};

const req = https.request(getOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const json = JSON.parse(data);
        let content = json.content.raw;

        console.log('Original content length:', content.length);

        // Fix 1: Update company name
        content = content.replace(
            'キャリアリンクアジアでタイ転職を実現',
            'キャリアリンクリクルートメントタイランドでタイ転職を実現'
        );
        console.log('Fixed: Company name');

        // Fix 2: Remove "ビザ取得、"
        content = content.replace(
            '求人紹介からビザ取得、入社後のフォローまで',
            '求人紹介から入社後のフォローまで'
        );
        console.log('Fixed: Removed visa mention');

        // Fix 3: Update background color (dark navy to bright blue)
        content = content.replace(
            'background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
            'background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
        );
        console.log('Fixed: Background color');

        // Fix 4: Update heading color (gold to bright yellow)
        content = content.replace(
            'color: #ffd700; margin: 0 0 15px 0;">キャリアリンクリクルートメントタイランドでタイ転職を実現',
            'color: #fef08a; margin: 0 0 15px 0;">キャリアリンクリクルートメントタイランドでタイ転職を実現'
        );
        console.log('Fixed: Heading color');

        // Fix 5: Update button colors
        content = content.replace(
            'background: #ffd700; color: #1e3a5f;',
            'background: #fef08a; color: #1e40af;'
        );
        content = content.replace(
            'background: white; color: #1e3a5f;',
            'background: white; color: #1e40af;'
        );
        console.log('Fixed: Button colors');

        // Add class name if not present
        if (!content.includes('cta-jobseeker-thailand-full')) {
            content = content.replace(
                '<div style="background: linear-gradient(135deg, #2563eb',
                '<div class="cta-box cta-jobseeker-thailand-full" style="background: linear-gradient(135deg, #2563eb'
            );
            console.log('Fixed: Added class name');
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
                    console.log('SUCCESS!');
                } else {
                    console.log('Error:', updateRes.statusCode);
                }
            });
        });

        updateReq.write(postData);
        updateReq.end();
    });
});

req.end();
