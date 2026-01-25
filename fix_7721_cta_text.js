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
        const oldCompanyName = 'キャリアリンクアジアでタイ転職を実現';
        const newCompanyName = 'キャリアリンクリクルートメントタイランドでタイ転職を実現';

        if (content.includes(oldCompanyName)) {
            content = content.replace(oldCompanyName, newCompanyName);
            console.log('Fixed: Company name updated');
        }

        // Fix 2: Remove "ビザ取得、" from the text
        const oldText = '求人紹介からビザ取得、入社後のフォローまで';
        const newText = '求人紹介から入社後のフォローまで';

        if (content.includes(oldText)) {
            content = content.replace(oldText, newText);
            console.log('Fixed: Removed visa support mention');
        }

        // Fix 3: Add class name to the CTA div if not present
        const oldDivStart = '<div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">';
        const newDivStart = '<div class="cta-box cta-jobseeker-thailand-full" style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">';

        if (content.includes(oldDivStart)) {
            content = content.replace(oldDivStart, newDivStart);
            console.log('Fixed: Added CTA class name');
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
