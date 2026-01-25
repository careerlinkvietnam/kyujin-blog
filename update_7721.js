const https = require('https');
const fs = require('fs');

const json = JSON.parse(fs.readFileSync('temp_post_7721.json', 'utf8'));
let content = json.content.rendered;

console.log('Original length:', content.length, 'chars');

// Define the jobseeker CTA template
const ctaJobseekerThailand = `
<div class="cta-box cta-jobseeker-thailand" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #fff; padding: 28px; margin: 30px 0; border-radius: 8px; text-align: center;">
<h3 style="margin-top: 0; color: #fff; font-size: 1.3em;">タイで働きたい方へ</h3>
<p style="margin: 16px 0;">タイの日系企業求人を多数掲載中。キャリアアドバイザーが転職をサポートします。</p>
<p><a href="https://kyujin.careerlink.asia/jobseeker/register" style="display: inline-block; background: #fff; color: #e85a1c; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em;">無料会員登録はこちら</a></p>
<p style="font-size: 0.85em; opacity: 0.9; margin-bottom: 0;">※登録無料・非公開求人あり</p>
</div>
`;

// CTA insertion positions (we insert from end to start to preserve positions)
// Based on analysis:
// 1st CTA: Before "タイの求人市場の特徴" (19.7%) - good for ~15-20%
// 2nd CTA: Before "タイの生活費" (59.0%) - good for ~50%
// 3rd CTA: Before "関連記事" (96.1%) - end position

// Insert 3rd CTA: Before 関連記事 section
const relatedMatch = content.match(/<h2[^>]*>関連記事<\/h2>/i);
if (relatedMatch) {
    const relatedPos = content.indexOf(relatedMatch[0]);
    console.log(`3rd CTA: Inserting before 関連記事 at position ${relatedPos} (${((relatedPos/content.length)*100).toFixed(1)}%)`);
    content = content.substring(0, relatedPos) + ctaJobseekerThailand + '\n\n' + content.substring(relatedPos);
} else {
    console.log('Warning: Could not find 関連記事 section');
}

// Insert 2nd CTA: Before "タイの生活費" section (~59%)
const livingCostMatch = content.match(/<h2[^>]*>タイの生活費<\/h2>/i);
if (livingCostMatch) {
    const livingCostPos = content.indexOf(livingCostMatch[0]);
    console.log(`2nd CTA: Inserting before タイの生活費 at position ${livingCostPos} (${((livingCostPos/content.length)*100).toFixed(1)}%)`);
    content = content.substring(0, livingCostPos) + ctaJobseekerThailand + '\n\n' + content.substring(livingCostPos);
} else {
    console.log('Warning: Could not find タイの生活費 section');
}

// Insert 1st CTA: Before "タイの求人市場の特徴" section (~19.7%)
const jobMarketMatch = content.match(/<h2[^>]*>タイの求人市場の特徴<\/h2>/i);
if (jobMarketMatch) {
    const jobMarketPos = content.indexOf(jobMarketMatch[0]);
    console.log(`1st CTA: Inserting before タイの求人市場の特徴 at position ${jobMarketPos} (${((jobMarketPos/content.length)*100).toFixed(1)}%)`);
    content = content.substring(0, jobMarketPos) + ctaJobseekerThailand + '\n\n' + content.substring(jobMarketPos);
} else {
    console.log('Warning: Could not find タイの求人市場の特徴 section');
}

console.log('\nNew length:', content.length, 'chars');
console.log('Added:', content.length - json.content.rendered.length, 'chars');

// Verify CTA count
const ctaCount = (content.match(/cta-jobseeker-thailand/g) || []).length;
console.log('CTA count:', ctaCount);

// Save updated content for verification
fs.writeFileSync('temp_post_7721_updated.json', JSON.stringify({...json, content: {rendered: content}}, null, 2));
console.log('\nUpdated content saved to temp_post_7721_updated.json');

// Now update via API
const postData = JSON.stringify({ content: content });

const auth = Buffer.from('careerlinkasia:N2Zz bzSn AWve Pa83 Ap2S 6Mlw').toString('base64');

const options = {
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

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('SUCCESS! Post 7721 updated.');
            const result = JSON.parse(data);
            console.log('New content length:', result.content.rendered.length, 'chars');
        } else {
            console.log('Error:', res.statusCode);
            console.log(data.substring(0, 500));
        }
    });
});

req.on('error', (e) => console.error('Request error:', e));
req.write(postData);
req.end();
